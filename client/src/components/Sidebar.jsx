import { useLocation, useNavigate } from "react-router-dom";
import { useChannels } from "../features/channels/useChannels.js";
import { useGlobalShortcuts } from "../hooks/useGlobalShortcuts.js";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { channels, loading, error } = useChannels();
  const pathname = location.pathname;

  const isCreateFormPage =
    pathname === "/create" ||
    pathname === "/channels/create" ||
    pathname.endsWith("/edit");
  const isChannelDetailPage =
    pathname.startsWith("/channels/") &&
    pathname !== "/channels/create" &&
    !pathname.endsWith("/edit");

  useGlobalShortcuts([
    {
      combo: ["control", "shift", "c"],
      enabled: true,
      handler: () => navigate("/channels"),
    },
    {
      combo: ["control", "shift", "p"],
      enabled: !isCreateFormPage,
      handler: () => navigate("/profile"),
    },
    {
      combo: ["shift", "c"],
      enabled: true,
      handler: () => navigate("/channels/create"),
    },
    {
      combo: ["shift", "p"],
      enabled: pathname === "/" || isChannelDetailPage,
      handler: () => {
        if (!isChannelDetailPage) {
          sessionStorage.removeItem("channelID");
        }
        navigate("/create");
      },
    },
  ]);

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
    navigate(`/channels/${channelId}`);
  }
  return (
    <aside className="sidebar">
      <button
        type="button"
        className="sidebar__home"
        onClick={() => {
          sessionStorage.removeItem("channelID");
          navigate("/");
        }}
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
        <button
          type="button"
          className="sidebar__channels-button sidebar__channels-button--create"
          onClick={() => navigate("/channels/create")}
        >
          Create Channel
        </button>
        <button
  type="button"
  className="sidebar__channels-button"
  onClick={() => {
    sessionStorage.removeItem("channelID");
    navigate("/create");
  }}
>
  Create Post
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
