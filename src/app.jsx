import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Card, Col, Container, Nav, Row } from 'react-bootstrap';
import { Login } from './login/login';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';

export default function App() {
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
                                    <Nav.Link as={NavLink} to="/leaderboard">High Scores</Nav.Link>
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
                            <Route path="/" element={<Login />} />
                            <Route path="/game" element={<Game />} />
                            <Route path="/leaderboard" element={<Leaderboard />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Col>
                    <Col as="aside" xs={12} lg={3} className="order-1 order-lg-2">
                        <Card className="account-panel">
                            <h3 className="h5">Logged in as:</h3>
                            <p className="mb-0">JohnDoe</p>
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

function NotFound() {
  return <div className="text-center">404: Return to sender. Address unknown.</div>;
}