import React, { useState } from 'react';
import './login.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export function Login({ onAccountCreated }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitCredentials(event) {
    event.preventDefault();
    const playerName = username.trim();
    if (!playerName) {
      setMessage('Enter a player name.');
      return;
    }

    const action = event.nativeEvent.submitter?.value;
    const usernameKey = playerName.toLowerCase();
    setIsSubmitting(true);

    try {
      const accounts = readAccounts();
      const accountIndex = accounts.findIndex((account) => account.usernameKey === usernameKey);
      let authenticatedAccount;

      if (action === 'create') {
        if (accountIndex !== -1) {
          setMessage('An account with that player name already exists. Log in instead.');
          return;
        }

        const passwordSalt = createSalt();
        const passwordHash = await hashPassword(password, passwordSalt);
        accounts.push({
          username: playerName,
          usernameKey,
          passwordSalt,
          passwordHash,
          characterId: null,
        });
        saveAccounts(accounts);
        authenticatedAccount = accounts[accounts.length - 1];
        setMessage(`Account created and logged in as ${playerName}.`);
      } else {
        if (accountIndex === -1) {
          setMessage('No account was found for that player name.');
          return;
        }

        const account = accounts[accountIndex];
        const passwordHash = await hashPassword(password, account.passwordSalt);
        if (passwordHash !== account.passwordHash) {
          setMessage('The player name or password is incorrect.');
          return;
        }

        authenticatedAccount = account;
        setMessage(`Logged in as ${account.username}.`);
      }

      window.localStorage.setItem('lorebound.currentUsername', usernameKey);
      onAccountCreated(authenticatedAccount.username);
      setPassword('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save or verify this account.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Row className="gy-3 gx-lg-3 gy-lg-3">
      <Col xs={12}>
        <Card className="login-panel p-4">
          <h2>Login</h2>
          <p>Create a new account or log in with an account saved in this browser.</p>
          <fieldset>
            <legend className="h5">Account Information</legend>
            <Form onSubmit={submitCredentials}>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Player name</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
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

function readAccounts() {
  const storedAccounts = window.localStorage.getItem('lorebound.accounts');
  if (!storedAccounts) {
    return [];
  }

  const accounts = JSON.parse(storedAccounts);
  if (!Array.isArray(accounts)) {
    throw new Error('Saved account data is invalid. Clear the Lorebound browser storage and try again.');
  }

  return accounts;
}

function saveAccounts(accounts) {
  window.localStorage.setItem('lorebound.accounts', JSON.stringify(accounts));
}

function createSalt() {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  return bytesToBase64(salt);
}

async function hashPassword(password, salt) {
  if (!window.crypto?.subtle) {
    throw new Error('Secure password hashing is unavailable in this browser context.');
  }

  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const hash = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(salt),
      iterations: 310000,
      hash: 'SHA-256',
    },
    key,
    256
  );
  return bytesToBase64(new Uint8Array(hash));
}

function bytesToBase64(bytes) {
  return window.btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
  return Uint8Array.from(window.atob(value), (character) => character.charCodeAt(0));
}