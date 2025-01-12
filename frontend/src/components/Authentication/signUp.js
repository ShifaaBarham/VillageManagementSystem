import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "../../syles/signUp.css";
import { Link } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $password: String!, $full_name: String!, $role: String!) {
    signUp(username: $username, password: $password, full_name: $full_name, role: $role) {
      token
      role
      username
    }
  }
`;

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");
  const [signup] = useMutation(SIGNUP_MUTATION);

  const registerUser = async () => {
    if (!emailRegex.test(username)) {
      alert("Invalid email format");
      return;
    }

    if (!strongPasswordRegex.test(password)) {
      alert("Password must be at least 8 characters long, include uppercase, lowercase, number, and special character.");
      return;
    }

    try {
      await signup({ variables: { username, password, full_name: fullName, role } });
      alert("User registered successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="center-container">
      <div id="signUp">
        <h2>Sign Up</h2>
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          id="fullName"
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Choose a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={registerUser}>Sign Up</button>
        <div id="nm">
          <div className="mm">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
