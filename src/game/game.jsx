import React, { useEffect, useRef, useState } from 'react';
import './game.css';
import { Alert, Card, Col, Row } from 'react-bootstrap';
import {
  drawBattleScene,
  drawWaitingScreen,
  getRandomWeather,
  testDelayedPlayerHelpMessage,
} from './gameComponent';

export function Game() {
  const canvasRef = useRef(null);
  const [playerHelpMessage, setPlayerHelpMessage] = useState('');
  const [weather] = useState(getRandomWeather);
  const [battleStarted, setBattleStarted] = useState(false);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
      drawWaitingScreen(context);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    testDelayedPlayerHelpMessage().then((message) => {
      if (isMounted) {
        setPlayerHelpMessage(message);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  function startBattle() {
    const context = canvasRef.current?.getContext('2d');
    if (!context) {
      return;
    }

    drawBattleScene(context, {});
    setBattleStarted(true);
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