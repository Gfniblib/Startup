import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Game } from './game/game';
import { Leaderboard } from './leaderboard/leaderboard';

export default function App() {
  return (
    <BrowserRouter>
        <div className="body bg-dark text-light">
            <header className="site-header py-3">
                <div className="container">
                    <div className="row align-items-center gy-3">
                        <div className="col-8 col-lg-7">
                            <div className="d-flex flex-column align-items-start gap-3">
                                <div className="d-flex align-items-center gap-2">
                                    <h1 className="h2 mb-0 site-title">Lorebound</h1>
                                    <div className="brand-image-frame">
                                        <img className="brand-image" src="images/dogeMorionHat.jpg" alt="Doge Morion Hat" />
                                    </div>
                                </div>
                                <nav aria-label="Main navigation">
                                    <div className="d-flex flex-nowrap gap-2">
                                    <NavLink className="nav-link" to="">Login</NavLink>
                                    <NavLink className="nav-link" to="game">Game</NavLink>
                                    <NavLink className="nav-link" to="leaderboard">High Scores</NavLink>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="col-4 col-lg-5">
                            <div className="d-flex flex-column align-items-end text-end gap-2">
                                <p className="tagline mb-0">A roguelike by Andrew Hokanson</p>
                                <a href="https://github.com/Gfniblib/Startup">Github Repository</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/game" element={<Game />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </main>

            <footer className="site-footer text-center py-3">
                <p className="mb-0">&copy; 2026 Lorebound no copyrights here. No rights reserved.</p>
            </footer>
        </div>
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
}