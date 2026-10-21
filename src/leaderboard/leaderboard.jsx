import React, { useEffect, useState } from 'react';
import './leaderboard.css';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { leaderboardData } from '../game/gameComponent';

export function Leaderboard() {
  const [liveUpdates, setLiveUpdates] = useState(() => (
    Array.from({ length: 5 }, createLiveUpdate)
  ));

  useEffect(() => {
    let timeout;
    const scheduleUpdate = () => {
      const delay = Math.floor(Math.random() * 3000) + 1000;
      timeout = window.setTimeout(() => {
        setLiveUpdates((currentUpdates) => [
          createLiveUpdate(),
          ...currentUpdates,
        ].slice(0, 5));
        scheduleUpdate();
      }, delay);
    };

    scheduleUpdate();
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div>
      <Row className="gy-3 gx-lg-3 gy-lg-3 leaderboard-layout">
        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Heroes of Legend</h2>
            <p>Temporary in-memory leaderboard. Scores will eventually come from the database.</p>
            <Table striped hover responsive className="align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">Hero</th>
                    <th scope="col">Class</th>
                    <th scope="col">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => (
                    <tr key={entry.hero}>
                      <td>{index + 1}</td>
                      <td>{entry.hero}</td>
                      <td>{entry.heroClass}</td>
                      <td>{entry.score.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
            </Table>
          </Card>

        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Live updates</h2>
            <p>These updates will be replaced with real-time data from the game server.</p>
            <ul className="mb-0" aria-live="polite" aria-relevant="additions">
              {liveUpdates.map((update) => (
                <li key={update.id}>{update.message}</li>
              ))}
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function createLiveUpdate() {
  const hero = leaderboardData[Math.floor(Math.random() * leaderboardData.length)];
  const eventType = Math.floor(Math.random() * 4);
  let message;

  switch (eventType) {
    case 0:
      message = `New game: ${hero.hero} started a run.`;
      break;
    case 1: {
      const points = (Math.floor(Math.random() * 10) + 1) * 100;
      message = `Score jump: ${hero.hero} gained ${points} points.`;
      break;
    }
    case 2:
      message = `Challenge complete: ${hero.hero} cleared the vault.`;
      break;
    default:
      message = `Battle complete: ${hero.hero} ended a run.`;
  }

  return {
    id: `${Date.now()}-${Math.random()}`,
    message,
  };
}