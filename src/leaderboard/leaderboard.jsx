import React from 'react';
import './leaderboard.css';
import { Card, Col, Row, Table } from 'react-bootstrap';

export function Leaderboard() {
  return (
    <div>
      <Row className="gy-3 gx-lg-3 gy-lg-3 leaderboard-layout">
        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Heroes of Legend</h2>
            <p>Placeholder static leaderboard. Eventually will pull data from the database.</p>
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
                  <tr><td>1</td><td>Aria Dawn</td><td>Rogue Archivist</td><td>14,800</td></tr>
                  <tr><td>2</td><td>Kael Frost</td><td>Frostblade</td><td>13,250</td></tr>
                  <tr><td>3</td><td>Nyra Bloom</td><td>Wild Sage</td><td>12,600</td></tr>
                  <tr><td>4</td><td>Orin Vale</td><td>Guardian</td><td>11,920</td></tr>
                </tbody>
            </Table>
          </Card>

        </Col>

        <Col xs={12}>
          <Card as="section" className="content-section">
            <h2>Live updates</h2>
            <p>These updates will be replaced with real-time data from the game server.</p>
            <ul className="mb-0">
              <li>New game: Selene Thorn started a run.</li>
              <li>Score jump: Aria Dawn gained 600 points.</li>
              <li>Challenge complete: Nyra Bloom cleared the vault.</li>
              <li>Battle complete: Kael Frost ended a run.</li>
            </ul>
          </Card>
        </Col>
      </Row>
    </div>
  );
}