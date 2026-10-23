import React, { useEffect, useRef, useState } from 'react';
import './game.css';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import {
  Battle,
  Character,
  Goblin,
  Skeleton,
  Slime,
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
  const [battle, setBattle] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [selectingEnemy, setSelectingEnemy] = useState(false);
  const [battleMessage, setBattleMessage] = useState('');
  const [battleRevision, setBattleRevision] = useState(0);
  const [, setInitiativeRefresh] = useState(0);
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
    const context = canvasRef.current?.getContext('2d');
    if (context && battleStarted && battle) {
      drawBattleScene(context, battle);
    }
  }, [battleStarted, battle, battleRevision]);

  useEffect(() => {
    if (!battleStarted || !battle || currentTurn) {
      return undefined;
    }

    let ticksSinceRefresh = 0;
    const timer = window.setInterval(() => {
      const actor = battle.tick();
      ticksSinceRefresh += 1;

      if (actor) {
        setCurrentTurn(actor);
        setInitiativeRefresh((revision) => revision + 1);
      } else if (ticksSinceRefresh >= 10) {
        setInitiativeRefresh((revision) => revision + 1);
        ticksSinceRefresh = 0;
      }
    }, 10);

    return () => window.clearInterval(timer);
  }, [battleStarted, battle, currentTurn]);

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

    // TODO base enemies off of player strength and location
    const enemyTypes = [Goblin, Skeleton, Slime];
    const battle = new Battle({
      playerCharacters: [playerCharacter],
      enemies: Array.from({ length: 4 }, (_, index) => {
        const EnemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        return new EnemyType(`${EnemyType.name} ${index + 1}`);
      }),
    });

    setBattle(battle);
    setBattleStarted(true);
  }

  function finishTurn() {
    const nextActor = battle.finishTurn();
    setCurrentTurn(nextActor);
    setSelectingEnemy(false);
    setInitiativeRefresh((revision) => revision + 1);
  }

  function attackEnemy(enemy) {
    if (!currentTurn || !battle.playerCharacters.includes(currentTurn)) {
      return;
    }

    const damage = battle.attack(currentTurn, enemy);
    setBattleMessage(
      `${currentTurn.name} dealt ${damage.toFixed(2)} damage to ${enemy.name}.`
    );
    setBattleRevision((revision) => revision + 1);
    finishTurn();
  }

  function completeCurrentTurn() {
    if (currentTurn && battle.enemies.includes(currentTurn)) {
      const targets = battle.playerCharacters.filter((character) => character.currentHp > 0);
      if (targets.length > 0) {
        const target = targets[Math.floor(Math.random() * targets.length)];
        const damage = battle.attack(currentTurn, target);
        setBattleMessage(
          `${currentTurn.name} dealt ${damage.toFixed(2)} damage to ${target.name}.`
        );
        setBattleRevision((revision) => revision + 1);
      }
    }

    finishTurn();
  }

  function defend() {
    if (!currentTurn || !battle.playerCharacters.includes(currentTurn)) {
      return;
    }

    currentTurn.isDefending = true;
    setBattleMessage(`${currentTurn.name} is defending and will take 50% damage until their next turn.`);
    setBattleRevision((revision) => revision + 1);
    finishTurn();
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
            {battleStarted && battle && (
              <div className="battle-action-panel">
                <p className="battle-action-prompt" aria-live="polite">
                  {selectingEnemy
                    ? 'Select an enemy to attack.'
                    : currentTurn && battle.playerCharacters.includes(currentTurn)
                      ? `${currentTurn.name}'s actions`
                      : currentTurn
                        ? `${currentTurn.name} is taking a turn`
                        : 'Waiting for a turn'}
                </p>
                {battleMessage && (
                  <p className="battle-action-prompt" role="status">{battleMessage}</p>
                )}
                {selectingEnemy ? (
                  <div>
                    <div className="battle-action-grid">
                      {battle.enemies.filter((enemy) => enemy.currentHp > 0).map((enemy, index) => (
                        <button
                          className="battle-action-button"
                          key={`${enemy.name}-${index}`}
                          type="button"
                          onClick={() => {
                            setSelectingEnemy(false);
                            attackEnemy(enemy);
                          }}
                        >
                          {enemy.name}
                        </button>
                      ))}
                    </div>
                    <button
                      className="battle-action-cancel"
                      type="button"
                      onClick={() => {
                        setSelectingEnemy(false);
                        setBattleMessage('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="battle-action-grid">
                    <button
                      className="battle-action-button"
                      type="button"
                      disabled={!currentTurn || !battle.playerCharacters.includes(currentTurn)}
                      onClick={() => {
                        setBattleMessage('');
                        setSelectingEnemy(true);
                      }}
                    >
                      Attack
                    </button>
                    <button
                      className="battle-action-button"
                      type="button"
                      disabled={!currentTurn || !battle.playerCharacters.includes(currentTurn)}
                      onClick={defend}
                    >
                      Defend
                    </button>
                    <button className="battle-action-button" type="button" disabled>Skill</button>
                    <button className="battle-action-button" type="button" disabled>Item</button>
                  </div>
                )}
              </div>
            )}
            {!battleStarted && (
              <button className="game-start-button" type="button" onClick={startBattle}>
                Start battle
              </button>
            )}
          </div>
        </Col>

        {battle && (
          <Col xs={12}>
            <Card as="section" className="content-section turn-order">
              <h2>Turn order</h2>
              {currentTurn && (
                <p className="current-turn" role="status">
                  Current turn: <strong>{currentTurn.name}</strong>
                  <span> Resolve this entity's action to resume initiative.</span>
                </p>
              )}
              {currentTurn && (
                <button className="btn btn-primary mb-3" type="button" onClick={completeCurrentTurn}>
                  Complete {currentTurn.name}'s turn
                </button>
              )}
              <ol className="turn-order-list">
                {battle.getTurnOrder().map((entity, index) => (
                  <li className="turn-order-item" key={`${entity.name}-${index}`}>
                    <div className="turn-order-label">
                      <span>{entity.name}</span>
                      <span>{Math.floor(entity.initiative)} / 1000</span>
                    </div>
                    <div
                      className="initiative-track"
                      role="progressbar"
                      aria-label={`${entity.name} initiative`}
                      aria-valuemin="0"
                      aria-valuemax="1000"
                      aria-valuenow={Math.min(1000, Math.floor(entity.initiative))}
                    >
                      <div
                        className="initiative-fill"
                        style={{ width: `${Math.min(100, (entity.initiative / 1000) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Col>
        )}

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