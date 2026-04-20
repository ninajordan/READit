import Sidebar from "../components/Sidebar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import LoginPanel from "../components/LoginPanel.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-page__content">
        <Sidebar />
        <main className="login-page__main">
          <ProfileCard />
          <section className="login-page__welcome">
            <h1 className="login-page__title">Welcome to READit</h1>
            <p className="login-page__subtitle">The Anonymous Posting Forum</p>
          </section>
          <LoginPanel />
        </main>
      </div>
    </div>
  );
}
