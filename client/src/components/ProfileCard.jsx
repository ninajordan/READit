import "./ProfileCard.css";

export default function ProfileCard({ name = "Guest", handle = "Anonymous" }) {
  const storedHandle = sessionStorage.getItem("user_anonymity");
  const storedUserId = sessionStorage.getItem("userID");

  const displayHandle = storedHandle || handle;
  const displayName = storedUserId ? displayHandle : name;

  return (
    <section className="profile-card">
      <div className="profile-card__avatar">?</div>
      <div className="profile-card__details">
        <p className="profile-card__label">Profile</p>
        <p className="profile-card__name">{displayName}</p>
        <p className="profile-card__hint">
          {storedUserId ? "Anonymous identity active." : "Sign in to reveal your anonymous handle."}
        </p>
      </div>
    </section>
  );
}
