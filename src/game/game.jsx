import React, { useState } from 'react';
import './game.css';
import { Alert, Button, Card, Col, Image, Row } from 'react-bootstrap';

export function Game() {
  const [showNotification, setShowNotification] = useState(false);

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
            <h2>Today's Weather: Sunny</h2>
            <p>Weather effects on today's battles:</p>
            <ul>
              <li>Temperature: 75°F</li>
              <li>Wind: 10 mph</li>
              <li>Fire monsters will be stronger</li>
              <li>Water skills and spells will be weaker</li>
              <li>These values are just placeholders and will be replaced by live data from OpenWeather API</li>
            </ul>
          </Card>
        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <p>This button will be replaced to show up when the message is received via websocket</p>
            {showNotification && (
              <Alert variant="success" role="status">
                Your character helped someone else out!
              </Alert>
            )}
            <Button variant="primary" onClick={() => setShowNotification(true)}>
              Websocket Live Update Placeholder.
            </Button>
          </Card>
        </Col>

      </Row>
    </div>
  );
}