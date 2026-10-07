import React from 'react';
import './login.css';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

export function Login() {
  return (
    <Row className="gy-3 gx-lg-3 gy-lg-3">
      <Col xs={12}>
        <Card className="login-panel p-4">
          <h2>Login</h2>
          <p>Create a new account or login</p>
          <fieldset>
            <legend className="h5">Account Information</legend>
            <Form>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Player name</Form.Label>
                <Form.Control type="text" name="username" placeholder="Username" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Enter password" />
              </Form.Group>
              <Button className="me-2" variant="primary" type="submit">Create account</Button>
              <Button variant="outline-primary" type="button">Login</Button>
            </Form>
          </fieldset>
        </Card>
      </Col>
    </Row>
  );
}