import React, { useState } from 'react';
import './login.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export function Login({ onAccountCreated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function createAccount(event) {
    event.preventDefault();
    const playerName = username.trim();
    if (!playerName) {
      setMessage('Enter a player name.');
      return;
    }

    onAccountCreated(playerName);
    setMessage(`Account created for ${playerName}.`);
  }

  return (
    <Row className="gy-3 gx-lg-3 gy-lg-3">
      <Col xs={12}>
        <Card className="login-panel p-4">
          <h2>Login</h2>
          <p>Create a new account or login</p>
          <fieldset>
            <legend className="h5">Account Information</legend>
            <Form onSubmit={createAccount}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Player name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Form.Group>
              <Button className="me-2" variant="primary" type="submit">Create account</Button>
              <Button variant="outline-primary" type="button">Login</Button>
              {message && <p className="mt-3 mb-0" role="status">{message}</p>}
            </Form>
          </fieldset>
        </Card>
      </Col>
    </Row>
  );
}