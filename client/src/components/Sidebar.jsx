import { useNavigate } from "react-router-dom";
import { useChannels } from "../hooks/useChannels.js";
import "./Sidebar.css";

export default function Sidebar({ onChannelSelect }) {
  const { channels, status, error } = useChannels();
  const navigate = useNavigate();

  function handleHomeClick() {
    sessionStorage.removeItem("channelID");
    navigate("/");
  }

  return (
    <aside className="sidebar">
      <button type="button" className="sidebar__home" onClick={handleHomeClick}>
        ⌂
      </button>
      <div className="sidebar__brand">READit</div>
      <div className="sidebar__section">
        <p className="sidebar__label">Channels</p>
        {status === "loading" ? (
          <p className="sidebar__status">Loading channels...</p>
        ) : null}
        {status === "error" ? (
          <p className="sidebar__status sidebar__status--error">{error}</p>
        ) : null}
        <ul className="sidebar__list">
          {channels.map((channel) => (
            <li key={channel.channelID} className="sidebar__item">
              <button
                type="button"
                className="sidebar__link"
                data-channel-id={channel.channelID}
                onClick={() => onChannelSelect?.(channel)}
              >
                #{channel.channelName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
