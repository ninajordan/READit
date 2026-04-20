import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { useChannels } from "../features/channels/useChannels.js";
import "./ChannelPage.css";

export default function ChannelPage() {
  const navigate = useNavigate();
  const { channels, loading, error } = useChannels();

  return (
    <div className="channel-page">
      <div className="channel-page__content">
        <Sidebar />
        <main className="channel-page__main">
          <ProfileCard />
          <section className="channel-page__header">
            <h1 className="channel-page__title">Channels</h1>
            <p className="channel-page__subtitle">
              Choose a space and jump in.
            </p>
          </section>

          {loading ? (
            <p className="channel-page__status">Loading channels...</p>
          ) : null}
          {error ? (
            <p className="channel-page__status channel-page__status--error">
              {error}
            </p>
          ) : null}

          {!loading && !error ? (
            <section className="channel-page__grid">
              {channels.map((channel) => (
                <article
                  key={channel.channelID}
                  className="channel-page__card"
                  onClick={() => navigate(`/channels/${channel.channelID}`)}
                >
                  <div
                    className="channel-page__banner"
                    style={{
                      backgroundImage: channel.bannerImage
                        ? `url(${channel.bannerImage})`
                        : "linear-gradient(135deg, #101214 0%, #3b1d2c 50%, #8b3a2b 100%)",
                    }}
                  >
                    {!channel.bannerImage ? (
                      <span className="channel-page__banner-fallback">
                        {channel.channelName?.[0]?.toUpperCase() || "R"}
                      </span>
                    ) : null}
                  </div>
                  <p className="channel-page__tag">
                    {channel.channelCategory || "Channel"}
                  </p>
                  <h3 className="channel-page__name">#{channel.channelName}</h3>
                  <p className="channel-page__description">
                    {channel.channelDescription ||
                      "Anonymous conversations live here."}
                  </p>
                </article>
              ))}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
