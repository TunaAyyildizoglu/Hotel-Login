import { useState } from 'react';

export default function UseToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token_val');
    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token_val', userToken.token_val);
    setToken(userToken.token_val);
  };

  return {
    setToken: saveToken,
    token
  }
}