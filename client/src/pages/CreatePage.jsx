import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import CreatePostForm from "../components/CreatePostForm.jsx";
import { fetchChannelById } from "../features/channels/channelsApi.js";
import "./CreatePage.css";

export default function CreatePage() {
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    let isActive = true;
    const channelID = sessionStorage.getItem("channelID");
    if (!channelID || channelID === "-1") return;

    async function loadChannelName() {
      try {
        const response = await fetchChannelById(channelID);
        if (!isActive) return;
        const channel = response?.channelData?.channel || response?.channel || response;
        setChannelName(channel?.channelName || "");
      } catch {
        // ignore errors and keep default
      }
    }

    loadChannelName();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="create-page">
      <div className="create-page__content">
        <Sidebar />
        <main className="create-page__main">
          <ProfileCard />
          <section className="create-page__header">
            <h1 className="create-page__title">Create a new post</h1>
            <p className="create-page__subtitle">Share your story anonymously.</p>
          </section>
          {channelName ? (
            <p className="create-page__note">Adding post to #{channelName}</p>
          ) : null}
          <CreatePostForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}
