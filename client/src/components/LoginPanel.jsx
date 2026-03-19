import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/users/loginUser.js";
import "./LoginPanel.css";

export default function LoginPanel() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();
    if (!trimmedUsername || !password) {
      setError("Please enter username and password.");
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const response = await loginUser({ username: trimmedUsername, password });
      const user = response.user;

      sessionStorage.setItem("userID", user.userID);
      sessionStorage.setItem("user_anonymity", user.user_anonymity);

      setStatus("success");
      navigate("/");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Login failed.");
    }
  }

  return (
    <form className="login-panel" onSubmit={handleSubmit}>
      <label className="login-panel__label" htmlFor="login-username">
        Username
      </label>
      <input
        id="login-username"
        className="login-panel__input"
        placeholder="Enter your username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
      />

      <label className="login-panel__label" htmlFor="login-password">
        Password
      </label>
      <input
        id="login-password"
        className="login-panel__input"
        placeholder="Enter your password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="current-password"
      />

      <div className="login-panel__actions">
        <button
          className="login-panel__button"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "..." : "Login"}
        </button>
        <button
          type="button"
          className="login-panel__link"
          onClick={() => navigate("/register")}
        >
          Register user
        </button>
      </div>

      {error ? <p className="login-panel__error">{error}</p> : null}
    </form>
  );
}
