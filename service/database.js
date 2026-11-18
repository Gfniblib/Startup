const { MongoClient, ObjectId } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('lorebound');
const userCollection = db.collection('user');
const characterCollection = db.collection('character');
const scoreCollection = db.collection('score');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
  try {
    await db.command({ ping: 1 });
    await userCollection.createIndex({ email: 1 }, { unique: true });
    await characterCollection.createIndex({ userId: 1 });
    await scoreCollection.createIndex({ score: -1 });
    await scoreCollection.createIndex({ userId: 1, createdAt: -1 });
    console.log(`Connect to database`);
  } catch (ex) {
    console.log(`Unable to connect to database with ${url} because ${ex.message}`);
    process.exit(1);
  }
})();

function getUser(email) {
  return userCollection.findOne({ email: email });
}

function getUserByToken(token) {
  if (!token) return null;
  return userCollection.findOne({ token });
}

async function addUser(user) {
  const userDocument = {
    email: user.email.toLowerCase(),
    password: user.password,
    token: user.token,
    characterIds: [],
  };
  await userCollection.insertOne(userDocument);
  return userDocument;
}

async function updateUser(user) {
  const { _id, email, ...updates } = user;
  const filter = _id ? { _id } : { email: email.toLowerCase() };
  await userCollection.updateOne(filter, { $set: updates });
  return user;
}

async function updateUserRemoveAuth(user) {
  await userCollection.updateOne(
    { _id: user._id },
    { $unset: { token: 1 } }
  );
}

async function addCharacter(userId, character) {
  const characterDocument = {
    ...character,
    userId: new ObjectId(userId),
  };
  const result = await characterCollection.insertOne(characterDocument);

  await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $push: { characterIds: result.insertedId } }
  );

  return characterDocument;
}

function getCharacter(characterId) {
  if (!characterId) return null;
  return characterCollection.findOne({ _id: new ObjectId(characterId) });
}

async function updateCharacter(characterId, character) {
  const updates = { ...character };
  delete updates._id;
  delete updates.userId;
  const objectCharacterId = new ObjectId(characterId);
  const result = await characterCollection.updateOne(
    { _id: objectCharacterId },
    { $set: updates }
  );
  if (result.matchedCount === 0) {
    return null;
  }
  return characterCollection.findOne({ _id: objectCharacterId });
}

async function deleteCharacter(characterId, userId) {
  const objectCharacterId = new ObjectId(characterId);
  const objectUserId = new ObjectId(userId);
  await characterCollection.deleteOne({
    _id: objectCharacterId,
    userId: objectUserId,
  });
  await userCollection.updateOne(
    { _id: objectUserId },
    { $pull: { characterIds: objectCharacterId } }
  );
}

async function addScore(score) {
  const character = score.character && typeof score.character === 'object'
    ? { ...score.character }
    : null;

  const scoreDocument = {
    hero: score.hero.trim(),
    heroClass: score.heroClass.trim(),
    score: score.score,
    character,
    status: score.status || 'archived',
    createdAt: new Date(),
  };

  if (score.userId) {
    scoreDocument.userId = new ObjectId(score.userId);
  }
  if (score.characterId) {
    scoreDocument.characterId = new ObjectId(score.characterId);
  }

  return scoreCollection.insertOne(scoreDocument);
}

function getHighScores() {
  const query = { score: { $gte: 0 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

module.exports = {
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
};
