import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import RegisterPanel from "../components/RegisterPanel.jsx";
import "./RegisterPage.css";

export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="register-page__content">
        <Sidebar />
        <main className="register-page__main">
          <ProfileCard />
          <section className="register-page__welcome">
            <h1 className="register-page__title">Create your READit identity</h1>
            <p className="register-page__subtitle">Stay anonymous. Share honestly.</p>
          </section>
          <RegisterPanel />
        </main>
      </div>
      <Footer />
    </div>
  );
}
