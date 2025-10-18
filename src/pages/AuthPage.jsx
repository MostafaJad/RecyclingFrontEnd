// src/AuthPage.jsx

import { useContext, useState } from "react";
import "./AuthPage.css";
import { AuthContext } from "../auth-context";
function AuthPage() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const switchModeHandler = () => {
    setError(null);
    setSuccessMessage(null);
    setIsLoginMode((prevMode) => !prevMode);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (isLoginMode) {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          body: new URLSearchParams({ username: email, password: password }),
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.detail || "Login failed!");
        }
        console.log("--- SPY #2 (Browser): Received response ->", responseData);
        auth.login(responseData.access_token, responseData.user);
      } catch (err) {
        setError(err.message);
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/signup`, {
          method: "POST",
          body: JSON.stringify({ email, password }),
          headers: { "Content-Type": "application/json" },
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.detail || "Signup failed!");
        }
        setSuccessMessage("Account created! Please log in.");
        setIsLoginMode(true);
      } catch (err) {
        setError(err.message);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submitHandler}>
        <h2>{isLoginMode ? "Login" : "Sign Up"}</h2>
        {error && <p className="error-text">{error}</p>}
        {successMessage && <p className="success-text">{successMessage}</p>}
        {isLoading && <p>Sending request...</p>}
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoginMode ? "Login" : "Create Account"}
          </button>
          <button
            type="button"
            onClick={switchModeHandler}
            disabled={isLoading}
          >
            Switch to {isLoginMode ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthPage;
