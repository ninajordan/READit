import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/users/logoutUser.js";
import "./ProfileCard.css";

export default function ProfileCard({ name = "Guest", handle = "Anonymous" }) {
  const storedHandle = sessionStorage.getItem("user_anonymity");
  const storedUserId = sessionStorage.getItem("userID");
  const navigate = useNavigate();

  const displayHandle = storedHandle || handle;
  const displayName = storedUserId ? displayHandle : name;
  const avatarLabel = displayName?.trim()?.[0]?.toUpperCase() || "?";

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (err) {
      console.error(err);
    } finally {
      sessionStorage.clear();
      navigate("/login");
    }
  }

  return (
    <section className="profile-card">
      <button
        type="button"
        className="profile-card__avatar"
        onClick={() => navigate("/profile")}
        aria-label="Open profile page"
      >
        {avatarLabel}
      </button>
      <div className="profile-card__details">
        <p className="profile-card__label">Profile</p>
        <p className="profile-card__name">{displayName}</p>
        <p className="profile-card__hint">
          {storedUserId
            ? "Anonymous identity active."
            : "Sign in to reveal your anonymous handle."}
        </p>
      </div>
      {storedUserId ? (
        <button
          type="button"
          className="profile-card__logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      ) : null}
    </section>
  );
}
