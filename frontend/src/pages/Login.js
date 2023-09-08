import React from 'react';
import Login from '../components/Login';
import Header from "../components/Header";

import "../styles/LoginPage.css";

function LoginPage() {
  return (
    <div className="background">
        <Header />
      <Login />
    </div>
  );
}

export default LoginPage;
