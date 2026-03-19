import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useChannels } from "./useChannels.js";
import "./ChannelBrowser.css";

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80";

const CHANNEL_VISUALS = {
  General: {
    heroImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    description:
      "Welcome to the general channel. A broad space for thoughts, discussion, random findings, and whatever people feel like sharing anonymously.",
  },
  Confessions: {
    heroImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    description:
      "A place for secrets, admissions, and strange midnight truths. Anonymous, dramatic, and occasionally deeply sincere.",
  },
  Art: {
    heroImage:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80",
    description:
      "Share sketches, paintings, ideas, unfinished work, and the weird creative sparks that deserve an audience.",
  },
  Fitness: {
    heroImage:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    description:
      "Gym sessions, yoga thoughts, routines, setbacks, wins, and all the little rituals of feeling strong.",
  },
  News: {
    heroImage:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1600&q=80",
    description:
      "Current events, reactions, and headlines worth arguing over. Bring your takes and your restraint.",
  },
  Literature: {
    heroImage:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80",
    description:
      "Books, reading, analysis, favorite passages, and the serious business of caring too much about fiction.",
  },
  Universities: {
    heroImage:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
    description:
      "Campus life, academics, deadlines, ambition, confusion, and everything strange about being in school.",
  },
  Travel: {
    heroImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    description:
      "Destinations, city notes, dream trips, local discoveries, and places that feel cinematic.",
  },
  "Tech Talk": {
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    description:
      "Code, tools, product ideas, debugging pain, and all things tech.",
  },
};

const FALLBACK_POSTS = {
  General: [
    {
      id: 1,
      title: "A thought on current affairs",
      body: "So I was thinking about the impact of the new regulations...",
    },
    {
      id: 2,
      title: "Late-night observation",
      body: "Does anyone else feel like every public space has its own mood?",
    },
  ],
  Confessions: [
    {
      id: 1,
      title: "I almost sent the message",
      body: "Wrote it, reread it twelve times, then deleted it anyway.",
    },
    {
      id: 2,
      title: "Secret ritual",
      body: "Sometimes I walk an extra block just to avoid a familiar face.",
    },
  ],
  Art: [
    {
      id: 1,
      title: "Creative block report",
      body: "I haven’t finished anything in weeks, but I still keep starting.",
    },
    {
      id: 2,
      title: "Sketchbook confession",
      body: "My best work always starts looking like a mistake.",
    },
  ],
  Fitness: [
    {
      id: 1,
      title: "Gym return after a break",
      body: "First workout back somehow felt humiliating and glorious at once.",
    },
    {
      id: 2,
      title: "Unexpected yoga win",
      body: "A pose that felt impossible last month suddenly opened up today.",
    },
  ],
  News: [
    {
      id: 1,
      title: "Headline fatigue",
      body: "How do you stay informed without feeling psychologically flattened?",
    },
    {
      id: 2,
      title: "Hot take check",
      body: "Some stories are less about facts and more about performance.",
    },
  ],
  Literature: [
    {
      id: 1,
      title: "Book that changed your mood",
      body: "What’s one novel that rearranged your inner weather?",
    },
    {
      id: 2,
      title: "Character loyalty problem",
      body: "I always end up defending the most doomed person in the book.",
    },
  ],
  Universities: [
    {
      id: 1,
      title: "Library atmosphere",
      body: "Every campus library feels like stress turned architectural.",
    },
    {
      id: 2,
      title: "Class discussion regret",
      body: "Thought of the perfect point twenty minutes after class ended.",
    },
  ],
  Travel: [
    {
      id: 1,
      title: "Best city at night?",
      body: "What place felt most alive after dark without trying too hard?",
    },
    {
      id: 2,
      title: "Accidental favorite trip",
      body: "Sometimes the place you planned the least becomes the one you remember.",
    },
  ],
  "Tech Talk": [
    {
      id: 1,
      title: "Bug spiral",
      body: "Fixed one issue and accidentally discovered three more.",
    },
    {
      id: 2,
      title: "Tool loyalty question",
      body: "How long do you stay with a stack before admitting it’s annoying?",
    },
  ],
};

export default function ChannelBrowser() {
    const { channels: rawChannels, loading, error } = useChannels();
    const channels = Array.isArray(rawChannels)
      ? rawChannels
      : Array.isArray(rawChannels?.channels)
        ? rawChannels.channels
        : [];
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [dismissedPostIds, setDismissedPostIds] = useState([]);

  useEffect(() => {
    if (!channels.length) return;
    if (selectedChannelId) return;

    const firstId = channels[0]._id || channels[0].id || channels[0].channelID;
    setSelectedChannelId(String(firstId));
  }, [channels, selectedChannelId]);

  const selectedChannel = useMemo(() => {
    if (!channels.length) return null;

    return (
      channels.find((channel) => {
        const value = channel._id || channel.id || channel.channelID;
        return String(value) === String(selectedChannelId);
      }) || channels[0]
    );
  }, [channels, selectedChannelId]);

  const selectedChannelName = selectedChannel?.channelName || "General";
  const channelVisual = CHANNEL_VISUALS[selectedChannelName] || {};

  const visiblePosts = useMemo(() => {
    const rawPosts =
      selectedChannel?.previewPosts?.length
        ? selectedChannel.previewPosts
        : FALLBACK_POSTS[selectedChannelName] || FALLBACK_POSTS.General;

    return rawPosts.filter((post) => {
      const postKey = post.id || post._id || post.postID;
      return !dismissedPostIds.includes(String(postKey));
    });
  }, [selectedChannel, selectedChannelName, dismissedPostIds]);

  const currentPost = visiblePosts[0] || null;

  function handleSelectChannel(channel) {
    const nextId = channel._id || channel.id || channel.channelID;
    setSelectedChannelId(String(nextId));
    setDismissedPostIds([]);
  }

  function handleRejectPost() {
    if (!currentPost) return;
    const postKey = currentPost.id || currentPost._id || currentPost.postID;
    setDismissedPostIds((prev) => [...prev, String(postKey)]);
  }

  function handleAcceptPost() {
    if (!currentPost) return;
    const postKey = currentPost.id || currentPost._id || currentPost.postID;
    setDismissedPostIds((prev) => [...prev, String(postKey)]);
  }

  return (
    <section className="channel-browser-v2">
      <div className="channel-browser-v2__shell">
        <aside className="channel-browser-v2__sidebar">
          <div className="channel-browser-v2__sidebar-header">
            <h2>CHANNELS</h2>
          </div>

          {loading ? (
            <p className="channel-browser-v2__sidebar-status">Loading...</p>
          ) : null}

          {error ? (
            <p className="channel-browser-v2__sidebar-status channel-browser-v2__sidebar-status--error">
              {error}
            </p>
          ) : null}

          <nav className="channel-browser-v2__channel-list">
            {channels.map((channel) => {
              const channelKey = channel._id || channel.id || channel.channelID;
              const isActive = String(channelKey) === String(selectedChannelId);

              return (
                <button
                  key={channelKey}
                  type="button"
                  className={`channel-browser-v2__channel-pill ${
                    isActive ? "is-active" : ""
                  }`}
                  onClick={() => handleSelectChannel(channel)}
                >
                  #{channel.channelName}
                </button>
              );
            })}
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

          {selectedChannel && (
            <>
              <section
                className="channel-browser-v2__hero"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,0,0,.28), rgba(0,0,0,.18)), url(${
                    channelVisual.heroImage || selectedChannel.heroImage || FALLBACK_HERO
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
                    #{selectedChannelName.toUpperCase()}
                  </h1>
                </div>
              </section>

              <section className="channel-browser-v2__content-stage">
                <div className="channel-browser-v2__description">
                  <p>
                    {channelVisual.description ||
                      selectedChannel.channelDescription ||
                      "Welcome to this channel. Share thoughts, reactions, ideas, and whatever deserves a place in the conversation."}
                  </p>
                </div>

                <div className="channel-browser-v2__post-stack">
                  {currentPost ? (
                    <article className="channel-browser-v2__post-card channel-browser-v2__post-card--1">
                      <h3>{currentPost.title}</h3>
                      <p>{currentPost.body}</p>
                    </article>
                  ) : (
                    <div className="channel-browser-v2__empty-posts">
                      No more posts in this channel right now.
                    </div>
                  )}
                </div>

                <div className="channel-browser-v2__actions">
                  <button
                    type="button"
                    className="channel-browser-v2__action channel-browser-v2__action--dismiss"
                    onClick={handleRejectPost}
                    aria-label="Reject post"
                  >
                    ✕
                  </button>

                  <Link
                    to={`/channels/${selectedChannel._id || selectedChannel.id || selectedChannel.channelID}`}
                    className="channel-browser-v2__action channel-browser-v2__action--comment"
                    aria-label="View channel"
                  >
                    💬
                  </Link>

                  <button
                    type="button"
                    className="channel-browser-v2__action channel-browser-v2__action--approve"
                    onClick={handleAcceptPost}
                    aria-label="Accept post"
                  >
                    ✓
                  </button>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </section>
  );
}