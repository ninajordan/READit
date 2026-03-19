import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../features/users/registerUser.js";
import "./RegisterPanel.css";

export default function RegisterPanel() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedName = name.trim();
    if (!trimmedUsername || !password || !trimmedName) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const response = await registerUser({
        username: trimmedUsername,
        password,
        name: trimmedName,
      });
      const user = response.user;

      sessionStorage.setItem("userID", user.userID);
      sessionStorage.setItem("user_anonymity", user.user_anonymity);

      setStatus("success");
      navigate("/");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Registration failed.");
    }
  }

  return (
    <form className="register-panel" onSubmit={handleSubmit}>
      <label className="register-panel__label" htmlFor="register-name">
        Name
      </label>
      <input
        id="register-name"
        className="register-panel__input"
        placeholder="Enter your name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        autoComplete="name"
      />

      <label className="register-panel__label" htmlFor="register-username">
        Username
      </label>
      <input
        id="register-username"
        className="register-panel__input"
        placeholder="Create a username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        autoComplete="username"
      />

      <label className="register-panel__label" htmlFor="register-password">
        Password
      </label>
      <input
        id="register-password"
        className="register-panel__input"
        placeholder="Create a password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoComplete="new-password"
      />

      <div className="register-panel__actions">
        <button
          className="register-panel__button"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "..." : "Register"}
        </button>
        <button
          type="button"
          className="register-panel__link"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>

      {error ? <p className="register-panel__error">{error}</p> : null}
    </form>
  );
}
