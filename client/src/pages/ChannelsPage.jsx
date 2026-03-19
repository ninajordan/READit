import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import "./ChannelsPage.css";

export default function ChannelsPage() {
  return (
    <div className="channels-page">
      <div className="channels-page__content">
        <Sidebar />
        <main className="channels-page__main">
          <ProfileCard />
          <section className="channels-page__header">
            <h1 className="channels-page__title">Browse channels</h1>
            <p className="channels-page__subtitle">Pick a topic and dive in.</p>
          </section>
          <p className="channels-page__note">Channels page coming next.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}
