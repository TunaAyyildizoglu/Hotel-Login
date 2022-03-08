import React, { Component, useState } from 'react'
import ReactDOM from "react-dom";
import UseToken from '../UseToken';

import "../style.css";

function loginUser(credentials) {
  return fetch('https://www.icibot.net/p_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    },
    body: JSON.stringify(credentials)
  })
    .then(handleResponse)
    .then(user => {
      return user;
    })
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}

function LoginPage() {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [err, setError] = useState();
  const { token, setToken } = UseToken();

  if (token) {
    window.location.href = "/";
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    loginUser({
      username,
      password,
      "hotel_id": 3,
    }).then(
      user => {
        if (user) {
          setToken(user);
          window.location.href = "/";
        }
      },
      error => {
        setError(error);
      }
    );
  };

  return (
    <div className="app">
      <div className="login-form">
        <div className="title">Login</div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label>Username </label>
              <input type="text" required onChange={e => setUserName(e.target.value)} />
            </div>
            <div className="input-container">
              <label>Password </label>
              <input type="password" required onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="button-container">
              <input type="submit" />
            </div>
            {err && <div className={'alert alert-danger'}>{err}</div>}
          </form>
        </div>
      </div>
    </div>

  )
}

export default LoginPage;