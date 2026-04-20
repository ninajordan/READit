import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import ChannelForm from "../components/ChannelForm.jsx";
import {
  fetchChannelById,
  updateChannel,
} from "../features/channels/channelsApi.js";
import "./CreatePage.css";

export default function EditChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadChannel() {
      try {
        const response = await fetchChannelById(id);
        const foundChannel =
          response?.channelData?.channel ||
          response?.channel ||
          response?.channelData;
        setChannel(foundChannel);
      } catch (err) {
        setError(err.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    }

    loadChannel();
  }, [id]);

  async function handleUpdateChannel(updates) {
    await updateChannel(id, {
      channelName: updates.channelName,
      channelDescription: updates.channelDescription,
      channelCategory: updates.channelCategory,
      showOnHomepage: updates.Homepage,
    });

    sessionStorage.setItem("channelID", id);
    navigate("/channels");
  }

  return (
    <div className="create-page">
      <div className="create-page__content">
        <Sidebar />
        <main className="create-page__main">
          <ProfileCard />
          <section className="create-page__header">
            <h1 className="create-page__title">Edit channel</h1>
            <p className="create-page__subtitle">
              Update this channel’s details.
            </p>
          </section>

          {loading ? <p>Loading channel...</p> : null}
          {error ? <p>{error}</p> : null}

          {!loading && !error && channel ? (
            <ChannelForm
              initialValues={{
                channelName: channel.channelName || "",
                channelDescription: channel.channelDescription || "",
                channelCategory: channel.channelCategory || "",
                Homepage: channel.showOnHomepage || false,
              }}
              onSubmit={handleUpdateChannel}
              submitLabel="Update Channel"
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
