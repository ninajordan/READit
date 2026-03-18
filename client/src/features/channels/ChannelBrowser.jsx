import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useChannels } from "./useChannels.js";
import "./ChannelBrowser.css";

const CHANNEL_CATEGORIES = [
  "Tech",
  "General",
  "Confessions",
  "Art",
  "Fitness",
  "News",
  "Literature",
  "Universities",
  "Travel",
];

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80";

export default function ChannelBrowser() {
  const {
    channels,
    filters,
    loading,
    error,
    updateFilters,
  } = useChannels();

  const [selectedChannelId, setSelectedChannelId] = useState(null);

  const selectedChannel = useMemo(() => {
    if (!channels.length) return null;

    const found = channels.find(
      (channel) => String(channel._id || channel.id) === String(selectedChannelId)
    );

    return found || channels[0];
  }, [channels, selectedChannelId]);

  function handleSearchChange(event) {
    updateFilters({ search: event.target.value });
  }

  function handleCategoryClick(category) {
    updateFilters({ category });
  }

  return (
    <section className="channel-browser-v2">
      <div className="channel-browser-v2__shell">
        <aside className="channel-browser-v2__sidebar">
          <div className="channel-browser-v2__sidebar-header">
            <h2>CHANNELS</h2>
          </div>

          <div className="channel-browser-v2__search-wrap">
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder="Search channels..."
              className="channel-browser-v2__search"
            />
          </div>

          <nav className="channel-browser-v2__channel-list">
            {CHANNEL_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`channel-browser-v2__channel-pill ${
                  filters.category === category ? "is-active" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                #{category}
              </button>
            ))}
          </nav>
        </aside>

        <main className="channel-browser-v2__main">
          <div className="channel-browser-v2__browser-bar">
            <div className="channel-browser-v2__browser-dots">
              <span />
              <span />
              <span />
            </div>
            <div className="channel-browser-v2__browser-url">readit.com</div>
          </div>

          {loading && (
            <div className="channel-browser-v2__status">
              Loading channels...
            </div>
          )}

          {error && !loading && (
            <div className="channel-browser-v2__status channel-browser-v2__status--error">
              {error}
            </div>
          )}

          {!loading && !error && selectedChannel && (
            <>
              <section
                className="channel-browser-v2__hero"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.18)), url(${
                    selectedChannel.heroImage || FALLBACK_HERO
                  })`,
                }}
              >
                <button
                  type="button"
                  className="channel-browser-v2__menu-button"
                  aria-label="Open menu"
                >
                  ☰
                </button>

                <div className="channel-browser-v2__hero-overlay">
                  <h1 className="channel-browser-v2__hero-title">
                    #{selectedChannel.channelName || "GENERAL"}
                  </h1>
                </div>
              </section>

              <section className="channel-browser-v2__content-stage">
                <div className="channel-browser-v2__description">
                  <p>
                    {selectedChannel.description ||
                      "Welcome to this channel. A bold, expressive space for discussion, ideas, and whatever people need to get off their chest. Share responsibly and keep the conversation moving."}
                  </p>
                </div>

                <div className="channel-browser-v2__post-stack">
                  {(selectedChannel.previewPosts?.length
                    ? selectedChannel.previewPosts
                    : [
                        {
                          id: 1,
                          title: "A thought on current affairs",
                          body: "So I was thinking about the impact of the new regulations...",
                        },
                        {
                          id: 2,
                          title: "Late-night campus observation",
                          body: "Does anyone else feel like the library has its own weather system?",
                        },
                        {
                          id: 3,
                          title: "Best hidden spot in Boston?",
                          body: "Looking for places that feel cinematic but not overcrowded.",
                        },
                      ]
                  ).map((post, index) => (
                    <article
                      key={post.id || post._id || index}
                      className={`channel-browser-v2__post-card channel-browser-v2__post-card--${
                        index + 1
                      }`}
                    >
                      <h3>{post.title}</h3>
                      <p>{post.body}</p>
                    </article>
                  ))}
                </div>

                <div className="channel-browser-v2__actions">
                  <button
                    type="button"
                    className="channel-browser-v2__action channel-browser-v2__action--dismiss"
                  >
                    ✕
                  </button>

                  <Link
                    to={`/channels/${selectedChannel._id || selectedChannel.id}`}
                    className="channel-browser-v2__action channel-browser-v2__action--comment"
                    aria-label="View channel"
                  >
                    💬
                  </Link>

                  <Link
                    to={`/channels/${selectedChannel._id || selectedChannel.id}`}
                    className="channel-browser-v2__action channel-browser-v2__action--approve"
                    aria-label="Enter channel"
                  >
                    ✓
                  </Link>
                </div>
              </section>

              <footer className="channel-browser-v2__bottom-nav">
                <button type="button" className="channel-browser-v2__bottom-item is-active">
                  <span>▦</span>
                  <span>CHANNELS</span>
                </button>

                <button type="button" className="channel-browser-v2__bottom-item">
                  <span>＋</span>
                  <span>CREATE</span>
                </button>

                <button type="button" className="channel-browser-v2__bottom-item">
                  <span>👤</span>
                  <span>PROFILE</span>
                </button>
              </footer>

              <section className="channel-browser-v2__mobile-channel-strip">
                {channels.map((channel) => (
                  <button
                    key={channel._id || channel.id}
                    type="button"
                    className={`channel-browser-v2__mini-channel ${
                      String(selectedChannel?._id || selectedChannel?.id) ===
                      String(channel._id || channel.id)
                        ? "is-selected"
                        : ""
                    }`}
                    onClick={() => setSelectedChannelId(channel._id || channel.id)}
                  >
                    #{channel.channelName}
                  </button>
                ))}
              </section>
            </>
          )}
        </main>
      </div>
    </section>
  );
}