import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { Card, Col, Container, Nav, Row } from 'react-bootstrap';
import { Login } from './login/login';
import {
  deleteCharacterForAccount,
  ensureAccountProfile,
  saveCharacterForAccount,
} from './login/accountStorage';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';
import { Character } from './game/gameComponent';

export default function App() {
  const [accountName, setAccountName] = useState('');
  const [playerCharacter, setPlayerCharacter] = useState(null);
  const [characterSaveError, setCharacterSaveError] = useState('');
  const [scoreError, setScoreError] = useState('');

  function handleAccountAuthenticated(username) {
    let account;
    try {
      account = ensureAccountProfile(username);
    } catch (error) {
      setCharacterSaveError(
        error instanceof Error ? error.message : 'Unable to load this account profile.'
      );
      return;
    }

    setAccountName(username);
    setPlayerCharacter(account.character ? restoreCharacter(account.character) : null);
    setCharacterSaveError('');
  }

  function handleCharacterCreated(character) {
    setPlayerCharacter(character);
    setCharacterSaveError('');

    if (!accountName) {
      return;
    }

    try {
      saveCharacterForAccount(accountName, character);
    } catch (error) {
      setCharacterSaveError(
        error instanceof Error ? error.message : 'Unable to save this character to the account.'
      );
    }
  }

  function handleCharacterUpdated(character) {
    setPlayerCharacter(character);
    setCharacterSaveError('');

    if (!accountName) {
      return;
    }

    try {
      saveCharacterForAccount(accountName, character);
    } catch (error) {
      setCharacterSaveError(
        error instanceof Error ? error.message : 'Unable to save this character to the account.'
      );
    }
  }

  function handleCharacterDefeated() {
    if (accountName) {
      try {
        deleteCharacterForAccount(accountName);
      } catch (error) {
        setCharacterSaveError(
          error instanceof Error ? error.message : 'Unable to delete this character from the account.'
        );
        return false;
      }
    }

    setPlayerCharacter(null);
    setCharacterSaveError('');
    return true;
  }

  async function handleManualCharacterDeletion() {
    if (!playerCharacter || !accountName) {
      handleCharacterDefeated();
      return;
    }

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          hero: playerCharacter.name,
          heroClass: playerCharacter.heroClass,
          score: playerCharacter.xp ?? 0,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.msg || 'Unable to save this character score.');
      }

      setScoreError('');
      handleCharacterDefeated();
    } catch (error) {
      setScoreError(error instanceof Error ? error.message : 'Unable to save this character score.');
    }
  }

  function handleLoggedOut() {
    setAccountName('');
    setPlayerCharacter(null);
    setCharacterSaveError('');
    setScoreError('');
  }

  return (
    <BrowserRouter>
        <div className="body d-flex flex-column min-vh-100">
            <header className="site-header py-3">
                <Container>
                    <Row className="align-items-center gy-3">
                        <Col xs={8} lg={7}>
                            <div className="d-flex flex-column align-items-start gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <h1 className="h2 mb-0 site-title">Lorebound</h1>
                                    <div className="brand-image-frame">
                                        <img className="brand-image" src="/dogeMorionHat.jpg" alt="Doge Morion Hat" />
                                    </div>
                                </div>
                                <Nav as="nav" aria-label="Main navigation" className="d-flex flex-nowrap gap-2">
                                    <Nav.Link as={NavLink} to="/">Login</Nav.Link>
                                    <Nav.Link as={NavLink} to="/game">Game</Nav.Link>
                                    {accountName && (
                                      <Nav.Link as={NavLink} to="/leaderboard">High Scores</Nav.Link>
                                    )}
                                </Nav>
                            </div>
                        </Col>
                        <Col xs={4} lg={5}>
                            <div className="d-flex flex-column align-items-end text-end gap-2">
                                <p className="tagline mb-0">A roguelike by Andrew Hokanson</p>
                                <a href="https://github.com/Gfniblib/Startup">Github Repository</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </header>

            <Container as="main" className="page-content flex-grow-1">
                <Row className="gy-3 gx-lg-3 gy-lg-3">
                    <Col xs={12} lg={9} className="order-2 order-lg-1">
                        <Routes>
                            <Route path="/" element={<Login onAccountCreated={handleAccountAuthenticated} />} />
                            <Route
                                path="/game"
                                element={(
                                    <Game
                                        playerCharacter={playerCharacter}
                                        onCharacterCreated={handleCharacterCreated}
                                        onCharacterUpdated={handleCharacterUpdated}
                                        onCharacterDefeated={handleCharacterDefeated}
                                        onScoreError={setScoreError}
                                    />
                                )}
                            />
                            <Route
                                path="/leaderboard"
                                element={accountName ? <Leaderboard /> : <Navigate to="/" replace />}
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Col>
                    <Col as="aside" xs={12} lg={3} className="order-1 order-lg-2">
                        <Card className="account-panel">
                            <h3 className="h5">Logged in as:</h3>
                            <p className="mb-0">{accountName || 'Guest'}</p>
                            {accountName && (
                                <LogoutButton
                                    onLogout={handleLoggedOut}
                                    onError={setCharacterSaveError}
                                />
                            )}
                            {playerCharacter && (
                                <section className="mt-3 pt-3 border-top" aria-label="Character">
                                    <h3 className="h5">{playerCharacter.name}</h3>
                                    <p className="mb-0">
                                        {playerCharacter.race} {playerCharacter.heroClass}
                                    </p>
                                    <p className="mb-0">Devoted to {playerCharacter.devotion}</p>
                                    <button
                                      className="btn btn-outline-danger mt-3"
                                      type="button"
                                      onClick={handleManualCharacterDeletion}
                                    >
                                      Delete character
                                    </button>
                                </section>
                            )}
                            {characterSaveError && (
                                <p className="text-danger mt-3 mb-0" role="alert">
                                    {characterSaveError}
                                </p>
                            )}
                            {scoreError && (
                                <p className="text-danger mt-3 mb-0" role="alert">
                                    {scoreError}
                                </p>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Container>

            <footer className="site-footer text-center py-3">
                <p className="mb-0">&copy; 2026 Lorebound no copyrights here. No rights reserved.</p>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function LogoutButton({ onLogout, onError }) {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    onError('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      if (!response.ok) {
        throw new Error('Unable to log out. Please try again.');
      }

      onLogout();
      navigate('/', { replace: true });
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Unable to log out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      className="btn btn-outline-secondary mt-3"
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? 'Logging out...' : 'Log out'}
    </button>
  );
}

function restoreCharacter(savedCharacter) {
  const character = new Character(
    savedCharacter.name,
    savedCharacter.heroClass,
    savedCharacter.race
  );
  Object.assign(character, savedCharacter);
  return character;
}

function NotFound() {
  return <div className="text-center">404: Return to sender. Address unknown.</div>;
}