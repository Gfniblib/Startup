import React, { useState } from 'react';
import './login.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export function Login({ onAccountCreated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitCredentials(event) {
    event.preventDefault();
    const action = event.nativeEvent.submitter?.value;
    const normalizedEmail = email.trim();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${action === 'create' ? 'create' : 'login'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('An account with that email already exists. Log in instead.');
        }
        if (response.status === 401) {
          throw new Error('The email or password is incorrect.');
        }
        throw new Error(result.msg || 'Unable to authenticate. Please try again.');
      }

      onAccountCreated(result.email, null);
      setMessage(action === 'create'
        ? `Account created and logged in as ${result.email}.`
        : `Logged in as ${result.email}.`);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Row className="gy-3 gx-lg-3 gy-lg-3">
      <Col xs={12}>
        <Card className="login-panel p-4">
          <h2>Login</h2>
          <p>Create an account or log in to load your saved character.</p>
          <fieldset>
            <legend className="h5">Account Information</legend>
            <Form onSubmit={submitCredentials}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
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
                  autoComplete="current-password"
                  required
                />
              </Form.Group>
              <Button
                className="me-2"
                variant="primary"
                type="submit"
                name="action"
                value="create"
                disabled={isSubmitting}
              >
                Create account
              </Button>
              <Button
                variant="outline-primary"
                type="submit"
                name="action"
                value="login"
                disabled={isSubmitting}
              >
                Login
              </Button>
              {message && <p className="mt-3 mb-0" role="status">{message}</p>}
            </Form>
          </fieldset>
        </Card>
      </Col>
    </Row>
  );
}