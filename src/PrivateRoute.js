import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import UseToken from './UseToken';

const PrivateRoute = () => {
  const { token, setToken } = UseToken();

  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute