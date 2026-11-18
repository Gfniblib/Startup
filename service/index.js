const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const express = require('express');
const uuid = require('uuid');
const app = express();
const {
  getUser,
  getUserByToken,
  addUser,
  updateUser,
  updateUserRemoveAuth,
  addCharacter,
  getCharacter,
  updateCharacter,
  deleteCharacter,
  addScore,
  getHighScores,
} = require('./database');

const authCookieName = 'token';

const weatherCache = {};
const weatherApiKey = process.env.OPENWEATHER_API_KEY;
const weatherRefreshInterval = 60 * 60 * 1000;
const weatherLocations = {
  'namarran-wastes': {
    label: 'Provo, US',
    query: { q: 'Provo,US' },
  },
  'barren-peaks': {
    label: 'McMurdo Station, Antarctica',
    query: { lat: '-77.8419', lon: '166.6863' },
  },
};

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// CreateAuth a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await findUser('email', req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);

    setAuthCookie(res, user.token);
    res.send({ email: user.email });
  }
});

// GetAuth login an existing user
apiRouter.post('/auth/login', async (req, res) => {
  const user = await findUser('email', req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      user.token = uuid.v4();
      await updateUser(user);
      setAuthCookie(res, user.token);
      res.send({ email: user.email });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth logout a user
apiRouter.delete('/auth/logout', async (req, res) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    await updateUserRemoveAuth(user);
  }
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// Middleware to verify that the user is authorized to call an endpoint
const verifyAuth = async (req, res, next) => {
  const user = await findUser('token', req.cookies[authCookieName]);
  if (user) {
    req.user = user;
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

apiRouter.get('/character', verifyAuth, async (req, res) => {
  const characterId = req.user.characterIds?.[0];
  const character = await getCharacter(characterId);
  res.send({ character });
});

apiRouter.put('/character', verifyAuth, async (req, res) => {
  const { character } = req.body;
  if (
    !character
    || typeof character !== 'object'
    || Array.isArray(character)
    || typeof character.name !== 'string'
    || typeof character.heroClass !== 'string'
    || typeof character.race !== 'string'
  ) {
    res.status(400).send({ msg: 'A character with a name, class, and race is required.' });
    return;
  }

  const characterId = req.user.characterIds?.[0];
  if (characterId) {
    await updateCharacter(characterId, character);
  } else {
    await addCharacter(req.user._id, character);
  }
  res.status(204).end();
});

apiRouter.delete('/character', verifyAuth, async (req, res) => {
  const characterId = req.user.characterIds?.[0];
  if (characterId) {
    const savedCharacter = await getCharacter(characterId);
    const character = req.body?.character ?? savedCharacter;
    if (
      !character
      || typeof character.name !== 'string'
      || typeof character.heroClass !== 'string'
    ) {
      res.status(404).send({ msg: 'Unable to find a valid character to archive.' });
      return;
    }

    await addScore({
      hero: character.name,
      heroClass: character.heroClass,
      score: Number.isFinite(character.xp) ? character.xp : 0,
      character,
      status: req.body?.status === 'dead' ? 'dead' : 'deleted',
      userId: req.user._id,
      characterId,
    });
    await deleteCharacter(characterId, req.user._id);
  }
  res.status(204).end();
});

// GetScores
apiRouter.get('/scores', verifyAuth, async (_req, res) => {
  res.send(await getHighScores());
});

apiRouter.get('/weather', (req, res) => {
  const location = req.query.location || 'namarran-wastes';
  if (!weatherLocations[location]) {
    res.status(400).send({ msg: 'Unknown weather location.' });
    return;
  }

  if (!weatherCache[location]) {
    res.status(503).send({ msg: 'Weather data is not available yet.' });
    return;
  }

  res.send(weatherCache[location]);
});

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});


async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    email: email.toLowerCase(),
    password: passwordHash,
    token: uuid.v4(),
    characterIds: [],
  };
  return addUser(user);
}

async function findUser(field, value) {
  if (!value) return null;

  if (field === 'token') {
    return getUserByToken(value);
  }
  if (field === 'email') {
    return getUser(value);
  }
  return null;
}

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    maxAge: 1000 * 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  if (!weatherApiKey) {
    console.error('OPENWEATHER_API_KEY is not set; weather updates are disabled.');
    return;
  }

  Object.keys(weatherLocations).forEach((location) => refreshWeather(location));
  setInterval(() => {
    Object.keys(weatherLocations).forEach((location) => refreshWeather(location));
  }, weatherRefreshInterval);
});

async function refreshWeather(location) {
  const weatherLocation = weatherLocations[location];
  const url = new URL('https://api.openweathermap.org/data/2.5/weather');
  Object.entries(weatherLocation.query).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  url.searchParams.set('units', 'imperial');
  url.searchParams.set('appid', weatherApiKey);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenWeather returned HTTP ${response.status}`);
    }

    const weather = await response.json();
    weatherCache[location] = {
      location: location === 'barren-peaks'
        ? weatherLocation.label
        : `${weather.name}, ${weather.sys.country}`,
      description: weather.weather[0].description,
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      humidity: weather.main.humidity,
      windSpeed: weather.wind.speed,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`Unable to refresh ${weatherLocation.label} weather:`, error);
  }
}
