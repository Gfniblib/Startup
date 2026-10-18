import React, { useEffect, useState } from 'react';
import './game.css';
import { Alert, Card, Col, Image, Row } from 'react-bootstrap';
import { testDelayedPlayerHelpMessage, getRandomWeather } from './gameComponent';

export function Game() {
  const [playerHelpMessage, setPlayerHelpMessage] = useState('');
  const [weather] = useState(getRandomWeather);

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

  return (
    <div>
      <Row className="gy-3 gx-lg-3 gy-lg-3 game-layout">
        <Col xs={12}>
          <Card as="section" className="content-section">
            <p>Game placeholder eventually application will go in this general area</p>
            <Image className="game-image" src="/gameWIP.jpg" alt="placeholder game image" />
          </Card>
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