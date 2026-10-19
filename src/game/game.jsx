import React, { useEffect, useRef, useState } from 'react';
import './game.css';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import {
  Battle,
  Character,
  Enemy,
  drawBattleScene,
  drawWaitingScreen,
  getRandomWeather,
  testDelayedPlayerHelpMessage,
} from './gameComponent';

export function Game({ playerCharacter, onCharacterCreated }) {
  const canvasRef = useRef(null);
  const [playerHelpMessage, setPlayerHelpMessage] = useState('');
  const [weather] = useState(getRandomWeather);
  const [battleStarted, setBattleStarted] = useState(false);
  const [characterDraft, setCharacterDraft] = useState({
    name: '',
    race: '',
    heroClass: '',
    devotion: '',
  });

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context && playerCharacter) {
      drawWaitingScreen(context);
    }
  }, [playerCharacter]);

  useEffect(() => {
    if (!playerCharacter) {
      return undefined;
    }

    let isMounted = true;

    testDelayedPlayerHelpMessage().then((message) => {
      if (isMounted) {
        setPlayerHelpMessage(message);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [playerCharacter]);

  function createCharacter(event) {
    event.preventDefault();
    const character = new Character(
      characterDraft.name.trim(),
      characterDraft.heroClass,
      characterDraft.race
    );
    character.devotion = characterDraft.devotion;
    onCharacterCreated(character);
  }

  function updateCharacterDraft(event) {
    const { name, value } = event.target;
    setCharacterDraft((currentDraft) => ({
      ...currentDraft,
      [name]: value,
    }));
  }

  function startBattle() {
    const context = canvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }

    const battle = new Battle({
      playerCharacters: [playerCharacter],
      enemies: Array.from({ length: 4 }, (_, index) => new Enemy(`Goblin ${index + 1}`, 'Goblin')),
    });

    drawBattleScene(context, battle);
    setBattleStarted(true);
  }

  if (!playerCharacter) {
    const choiceGroups = [
      { key: 'race', legend: 'Choose your people', options: ['Elf', 'Dwarf', 'Human'] },
      { key: 'heroClass', legend: 'Choose your class', options: ['Warrior', 'Mage', 'Cleric', 'Ranger'] },
      { key: 'devotion', legend: 'Choose your devotion', options: ['Cloud', 'Wind', 'Sun', 'Rain'] },
    ];

    return (
      <Card as="section" className="content-section character-creation">
        <h2>Create your character</h2>
        <p>Choose who you are before entering the battle.</p>
        <form onSubmit={createCharacter}>
          <label className="form-label" htmlFor="character-name">Character name</label>
          <input
            className="form-control character-name-input"
            id="character-name"
            name="name"
            type="text"
            value={characterDraft.name}
            onChange={updateCharacterDraft}
            pattern=".*\S.*"
            maxLength={24}
            title="Enter at least one non-space character."
            autoComplete="off"
            required
          />

          {choiceGroups.map(({ key, legend, options }) => (
            <fieldset className="character-choice-group" key={key}>
              <legend>{legend}</legend>
              <div className="character-choice-grid">
                {options.map((option, index) => {
                  const id = `${key}-${option.toLowerCase()}`;
                  const selected = characterDraft[key] === option;

                  return (
                    <label
                      className={`character-option${selected ? ' selected' : ''}`}
                      htmlFor={id}
                      key={option}
                    >
                      <input
                        className="form-check-input"
                        id={id}
                        name={key}
                        type="radio"
                        value={option}
                        checked={selected}
                        onChange={updateCharacterDraft}
                        required={index === 0}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <button className="btn btn-primary" type="submit">Create character</button>
        </form>
      </Card>
    );
  }

  return (
    <div>
      <Row className="gy-3 gx-lg-3 gy-lg-3 game-layout">
        <Col xs={12}>
          <div className="game-canvas-container">
            <canvas
              ref={canvasRef}
              className="game-canvas"
              width="960"
              height="540"
              aria-label="Battle scene. Waiting for battle to begin."
            />
            {!battleStarted && (
              <button className="game-start-button" type="button" onClick={startBattle}>
                Start battle
              </button>
            )}
          </div>
        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Today's Weather: {weather.weather}</h2>
            <p>Weather effects on today's battles:</p>
            <ul>
              {weather.effects.map((effect) => <li key={effect}>{effect}</li>)}
              <li>These values are just placeholders and will be replaced by live data from OpenWeather API</li>
            </ul>
          </Card>
        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <p>A test message will appear after a random delay of 30 to 60 seconds.</p>
            {playerHelpMessage && (
              <Alert variant="success" role="status">
                {playerHelpMessage}
              </Alert>
            )}
          </Card>
        </Col>

      </Row>
    </div>
  );
}