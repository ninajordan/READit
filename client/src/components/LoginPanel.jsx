import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/users/loginUser.js";
import "./LoginPanel.css";

export default function LoginPanel() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const response = await loginUser(trimmed);
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
      <label className="login-panel__label" htmlFor="login-name">
        Enter your name
      </label>
      <div className="login-panel__input-row">
        <input
          id="login-name"
          className="login-panel__input"
          placeholder="Enter your name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="off"
        />
        <button className="login-panel__button" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "..." : "→"}
        </button>
      </div>
      {error ? <p className="login-panel__error">{error}</p> : null}
    </form>
  );
}
