import { Link } from "react-router-dom";
import { useHomepageChannels } from "../features/channels/useChannels.js";
import "./HomePage.css";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80";

  export default function ChannelsPage() {
  const { channels, loading, error } = useHomepageChannels();

  const featuredChannel = channels?.[0] || null;
  const spotlightChannels = channels?.slice(1, 5) || [];

  return (
    <main className="homepage">
      <section className="homepage__hero-shell">
        <div className="homepage__browser-bar">
          <div className="homepage__dots">
            <span />
            <span />
            <span />
          </div>
          <div className="homepage__url">readit.com</div>
        </div>

        <section
          className="homepage__hero"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.35), rgba(0,0,0,.2)), url(${
              featuredChannel?.heroImage || FALLBACK_HERO
            })`,
          }}
        >
          <div className="homepage__hero-overlay">
            <p className="homepage__eyebrow">Anonymous. Expressive. Alive.</p>
            <h1 className="homepage__title">READit</h1>
            <p className="homepage__subtitle">
              Jump into channels for hot takes, soft confessions, campus chaos,
              art dumps, memes, and the occasional deeply unhinged midnight insight.
            </p>

            <div className="homepage__hero-actions">
              <Link to="/channels" className="homepage__button homepage__button--primary">
                Browse Channels
              </Link>
              {featuredChannel && (
                <Link
                  to={`/channels/${featuredChannel._id || featuredChannel.id}`}
                  className="homepage__button homepage__button--secondary"
                >
                  Enter Featured Channel
                </Link>
              )}
            </div>
          </div>
        </section>
      </section>

      <section className="homepage__content">
        <div className="homepage__intro-card">
          <div>
            <p className="homepage__section-label">Featured right now</p>
            <h2 className="homepage__section-title">Start where the conversation is hottest</h2>
          </div>
          <p className="homepage__section-copy">
            Pick a channel, lurk dramatically, or post something that changes the emotional weather.
          </p>
        </div>

        {loading && <p className="homepage__status">Loading homepage channels...</p>}
        {error && !loading && <p className="homepage__status homepage__status--error">{error}</p>}

        {!loading && !error && featuredChannel && (
          <section className="homepage__featured-grid">
            <article className="homepage__featured-card homepage__featured-card--main">
              <div className="homepage__featured-card-content">
                <p className="homepage__featured-tag">
                  #{featuredChannel.channelCategory || "Featured"}
                </p>
                <h3 className="homepage__featured-title">
                  #{featuredChannel.channelName}
                </h3>
                <p className="homepage__featured-description">
                  {featuredChannel.description ||
                    "A dynamic channel for conversation, reactions, sharp observations, and whatever else people need to say out loud."}
                </p>
                <Link
                  to={`/channels/${featuredChannel._id || featuredChannel.id}`}
                  className="homepage__featured-link"
                >
                  Open Channel
                </Link>
              </div>
            </article>

            <div className="homepage__spotlight-list">
              {spotlightChannels.map((channel) => (
                <article
                  key={channel._id || channel.id}
                  className="homepage__spotlight-card"
                >
                  <div>
                    <p className="homepage__spotlight-category">
                      {channel.channelCategory || "Channel"}
                    </p>
                    <h4 className="homepage__spotlight-title">
                      #{channel.channelName}
                    </h4>
                    <p className="homepage__spotlight-description">
                      {channel.description ||
                        "Drop in for conversation, reactions, anonymous posts, and the strange little ecosystem of a shared channel."}
                    </p>
                  </div>

                  <Link
                    to={`/channels/${channel._id || channel.id}`}
                    className="homepage__spotlight-link"
                  >
                    View
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="homepage__quick-links">
          <Link to="/channels" className="homepage__quick-link homepage__quick-link--channels">
            <span className="homepage__quick-icon">▦</span>
            <span>Explore All Channels</span>
          </Link>

          <button type="button" className="homepage__quick-link homepage__quick-link--create">
            <span className="homepage__quick-icon">＋</span>
            <span>Create a Post</span>
          </button>

          <button type="button" className="homepage__quick-link homepage__quick-link--profile">
            <span className="homepage__quick-icon">👤</span>
            <span>Profile</span>
          </button>
        </section>
      </section>
    </main>
  );
}
