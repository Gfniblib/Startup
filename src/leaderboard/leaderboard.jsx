import React, { useEffect, useState } from 'react';
import './leaderboard.css';
import { Card, Col, Row, Table } from 'react-bootstrap';

export function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let isMounted = true;

    async function loadScores() {
      try {
        const response = await fetch('/api/scores', { credentials: 'same-origin' });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.msg || 'Unable to load high scores.');
        }
        if (isMounted) {
          setScores(data);
          setError('');
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load high scores.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadScores();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (scores.length === 0) {
      setLiveUpdates([]);
      return undefined;
    }

    let timeout;
    const scheduleUpdate = () => {
      const delay = Math.floor(Math.random() * 3000) + 1000;
      timeout = window.setTimeout(() => {
        setLiveUpdates((updates) => [createLiveUpdate(scores), ...updates].slice(0, 5));
        scheduleUpdate();
      }, delay);
    };

    setLiveUpdates(Array.from({ length: 5 }, () => createLiveUpdate(scores)));
    scheduleUpdate();
    return () => window.clearTimeout(timeout);
  }, [scores]);

  return (
    <div>
      <Row className="gy-3 gx-lg-3 gy-lg-3 leaderboard-layout">
        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Heroes of Legend</h2>
            <p>High scores are temporarily stored in memory by the game server.</p>
            {isLoading && <p role="status">Loading high scores...</p>}
            {error && <p role="alert">{error}</p>}
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
                  {scores.map((entry, index) => (
                    <tr key={`${entry.hero}-${index}`}>
                      <td>{index + 1}</td>
                      <td>{entry.hero}</td>
                      <td>{entry.heroClass}</td>
                      <td>{entry.score.toLocaleString()}</td>
                    </tr>
                  ))}
                  {!isLoading && !error && scores.length === 0 && (
                    <tr>
                      <td colSpan="4">No scores yet.</td>
                    </tr>
                  )}
                </tbody>
            </Table>
          </Card>
        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Live updates</h2>
            <p>Updates are based on scores currently loaded from the game server.</p>
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

function createLiveUpdate(scores) {
  const hero = scores[Math.floor(Math.random() * scores.length)];
  const eventType = Math.floor(Math.random() * 4);
  let message;

  switch (eventType) {
    case 0:
      message = `New game: ${hero.hero} started a run.`;
      break;
    case 1:
      message = `Score recorded: ${hero.hero} earned ${hero.score.toLocaleString()} points.`;
      break;
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