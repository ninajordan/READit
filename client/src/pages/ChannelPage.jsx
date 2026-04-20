import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import { useChannels } from "../features/channels/useChannels.js";
import { useGlobalShortcuts } from "../hooks/useGlobalShortcuts.js";
import "./ChannelPage.css";

export default function ChannelPage() {
  const navigate = useNavigate();
  const { channels, loading, error } = useChannels();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);

  const columns = useMemo(() => {
    const width = gridRef.current?.clientWidth || 0;
    const minCardWidth = 240;
    const gap = 24;
    return Math.max(1, Math.floor((width + gap) / (minCardWidth + gap)));
  }, [channels.length, highlightedIndex]);

  useEffect(() => {
    if (!channels.length) return;
    setHighlightedIndex((current) => Math.min(current, channels.length - 1));
  }, [channels]);

  useEffect(() => {
    cardRefs.current[highlightedIndex]?.focus?.();
  }, [highlightedIndex]);

  function moveHighlight(delta) {
    if (!channels.length) return;
    setHighlightedIndex((current) => {
      const nextIndex = current + delta;
      return Math.max(0, Math.min(channels.length - 1, nextIndex));
    });
  }

  function openChannel(index = highlightedIndex) {
    const channel = channels[index];
    if (!channel?.channelID) return;
    navigate(`/channels/${channel.channelID}`);
  }

  useGlobalShortcuts([
    {
      combo: ["arrowright"],
      enabled: channels.length > 0,
      handler: () => moveHighlight(1),
    },
    {
      combo: ["arrowleft"],
      enabled: channels.length > 0,
      handler: () => moveHighlight(-1),
    },
    {
      combo: ["arrowdown"],
      enabled: channels.length > 0,
      handler: () => moveHighlight(columns),
    },
    {
      combo: ["arrowup"],
      enabled: channels.length > 0,
      handler: () => moveHighlight(-columns),
    },
    {
      combo: ["enter"],
      enabled: channels.length > 0,
      handler: () => openChannel(),
    },
  ]);

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
            <section ref={gridRef} className="channel-page__grid">
              {channels.map((channel, index) => (
                <button
                  key={channel.channelID}
                  ref={(element) => {
                    cardRefs.current[index] = element;
                  }}
                  type="button"
                  className={`channel-page__card${
                    highlightedIndex === index
                      ? " channel-page__card--highlighted"
                      : ""
                  }`}
                  onClick={() => openChannel(index)}
                  onFocus={() => setHighlightedIndex(index)}
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
                </button>
              ))}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
