import { useNavigate } from "react-router-dom";
import { useChannels } from "../features/channels/useChannels.js";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const { channels, loading, error } = useChannels();

  function getChannelId(channel) {
    return channel.channelID || channel._id || channel.id;
  }

  function getChannelName(channel) {
    return channel.channelName || channel.name || "Untitled";
  }

  function handleChannelClick(channel) {
    const channelId = channel.channelID || channel._id || channel.id;
    if (!channelId) return;
  
    sessionStorage.setItem("channelID", channelId);
    navigate("/channels");
  }
  return (
    <aside className="sidebar">
      <button
        type="button"
        className="sidebar__home"
        onClick={() => navigate("/")}
      >
        ⌂
      </button>

      <div className="sidebar__brand">READit</div>

      <div className="sidebar__section">
        <button
          type="button"
          className="sidebar__channels-button"
          onClick={() => navigate("/channels")}
        >
          Channels
        </button>

        {loading ? (
          <p className="sidebar__status">Loading channels...</p>
        ) : null}

        {error ? (
          <p className="sidebar__status sidebar__status--error">{error}</p>
        ) : null}

        <ul className="sidebar__list">
          {channels.map((channel) => {
            const channelId = getChannelId(channel);
            const channelName = getChannelName(channel);

            if (!channelId) return null;

            return (
              <li key={channelId} className="sidebar__item">
                <button
                  type="button"
                  className="sidebar__link"
                  onClick={() => handleChannelClick(channel)}
                >
                  #{channelName}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}