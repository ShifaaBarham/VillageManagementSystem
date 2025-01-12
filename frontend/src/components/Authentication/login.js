import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import "../../syles/login.css";
import { Link } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      role
      username
    }
  }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useMutation(LOGIN_MUTATION);
  const navigate = useNavigate();

  const loginUser = async () => {
    try {
      const { data } = await login({ variables: { username, password } });
      if (data?.login?.token && data?.login?.role) {
        localStorage.setItem("token", data.login.token);
        alert(`Welcome, ${data.login.username} (${data.login.role})`);
  
        // توجيه المستخدم إلى صفحة Overview
        navigate("/Overview"); 
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error('Login error:', error.message);
      alert(error.message); 
    }
  };
  

  return (
    <div className="center-container">
      <div id="login">
        <h2>Login</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={loginUser}>Login</button>
        <div id="tt">
  <p className="hh">
    Don't have an account? <Link to="/signup">Sign up</Link>
  </p>
</div>

      </div>
    </div>
  );
}

export default Login;
