import React from 'react';
import './game.css';

export function Game() {
  return (
    <div>
      <div className="row gy-3 gx-lg-3 gy-lg-3 game-layout">
        <div className="col-12">
          <section className="content-section">
            <p>Game placeholder eventually application will go in this general area</p>
            <img className="game-image" src="/gameWIP.jpg" alt="placeholder game image" />
          </section>
        </div>

        <div className="col-12">
          <section className="content-section">
            <h2>Today's Weather: Sunny</h2>
            <p>Weather effects on today's battles:</p>
            <ul>
              <li>Temperature: 75°F</li>
              <li>Wind: 10 mph</li>
              <li>Fire monsters will be stronger</li>
              <li>Water skills and spells will be weaker</li>
              <li>These values are just placeholders and will be replaced by live data from OpenWeather API</li>
            </ul>
          </section>  
        </div>

        <div className="col-12">
          <section className="content-section">
            <p>This button will be replaced to show up when the message is received via websocket</p>
            <div id="notification" className="alert alert-success d-none" role="status">
              Your character helped someone else out!
            </div>
            <button className="btn btn-primary" onClick={() => document.getElementById('notification').classList.remove('d-none')}>
              Websocket Live Update Placeholder.
            </button>
          </section>
        </div>

      </div>
    </div>
  );
}