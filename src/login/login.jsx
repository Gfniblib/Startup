import React from 'react';
import './login.css';

export function Login() {
  return (
    <div className="row gy-3 gx-lg-3 gy-lg-3">
      <div className="col-12">
        <div className="login-panel p-4">
          <h2>Login</h2>
          <p>Create a new account or login</p>
          <fieldset>
            <legend className="h5">Account Information</legend>
            <form>
              <div className="mb-3">
                <label className="form-label" htmlFor="username">Player name</label>
                <input className="form-control" type="text" id="username" name="username" placeholder="Username" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="password">Password</label>
                <input className="form-control" type="password" id="password" name="password" placeholder="Enter password" />
              </div>
              <button className="btn btn-primary me-2" type="submit">Create account</button>
              <button className="btn btn-outline-primary" type="button">Login</button>
            </form>
          </fieldset>
        </div>
      </div>
    </div>
  );
}