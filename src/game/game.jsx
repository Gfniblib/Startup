import React from 'react';

export function Game() {
  return (
    <main className="container-fluid page-content">
      <div class="row gy-3 gx-lg-3 gy-lg-3 game-layout">
        <div class="col-12 col-lg-9 order-2 order-lg-1">
          <section class="content-section">
            <p>Game placeholder eventually application will go in this general area</p>
            <img class="game-image" src="./images/gameWIP.jpg" alt="placeholder game image" />
          </section>
        </div>

        <aside class="col-12 col-lg-3 order-1 order-lg-2">
          <div class="account-panel">
            <h3 class="h5">Logged in as:</h3>
            <p class="mb-0">JohnDoe</p>
          </div>
        </aside>

        <div class="col-12 col-lg-9 order-3 order-lg-3">
          <section class="content-section">
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

        <div class="col-12 col-lg-9 order-4 order-lg-4">
          <section class="content-section">
            <p>This button will be replaced to show up when the message is received via websocket</p>
            <div id="notification" class="alert alert-success d-none" role="status">
              Your character helped someone else out!
            </div>
            <button class="btn btn-primary" onclick="document.getElementById('notification').classList.remove('d-none')">
              Websocket Live Update Placeholder.
            </button>
          </section>
        </div>

      </div>
    </main>
  );
}