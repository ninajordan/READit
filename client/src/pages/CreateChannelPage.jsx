import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import ChannelForm from "../components/ChannelForm.jsx";
import { createChannel } from "../features/channels/channelsApi.js";
import "./CreatePage.css";

export default function CreateChannelPage() {
  const navigate = useNavigate();

  async function handleCreateChannel(channelData) {
    const response = await createChannel(channelData);

    if (response?.channel?.channelID) {
      sessionStorage.setItem("channelID", response.channel.channelID);
    }

    navigate("/channels");
  }

  return (
    <div className="create-page">
      <div className="create-page__content">
        <Sidebar />
        <main className="create-page__main">
          <ProfileCard />
          <section className="create-page__header">
            <h1 className="create-page__title">Create a new channel</h1>
            <p className="create-page__subtitle">Start a new space for conversation.</p>
          </section>
          <ChannelForm
            onSubmit={handleCreateChannel}
            submitLabel="Create Channel"
          />
        </main>
      </div>
      <Footer />
    </div>
  );
}