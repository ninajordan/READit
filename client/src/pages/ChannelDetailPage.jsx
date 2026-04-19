import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // pj 4 improvement nav to channel after post creation
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import PostStack from "../components/PostStack.jsx";
import PostModal from "../components/PostModal.jsx";
import { registerLike } from "../features/likes/likesApi.js";
import { fetchChannelById } from "../features/channels/channelsApi.js";
import { fetchPostsInChannel } from "../features/posts/channelPostsApi.js";
import "./ChannelDetailPage.css";

export default function ChannelDetailPage() {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState({
    total: 0,
    start: 0,
    end: 0,
    limit: 20,
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [activePostID, setActivePostID] = useState(null);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [start, setStart] = useState(0);
  const limit = 20;

  useEffect(() => {
    let isActive = true;

    async function loadChannel() {
      try {
        setStatus("loading");
        setError("");
        if (id) {
          sessionStorage.setItem("channelID", id);
        }
        const response = await fetchChannelById(id);
        if (!isActive) return;
        setChannel(
          response?.channelData?.channel ||
            response?.channel ||
            response ||
            null,
        );
      } catch (err) {
        if (!isActive) return;
        setError(err.message || "Failed to load channel");
      } finally {
        if (isActive) setStatus("idle");
      }
    }

    loadChannel();

    return () => {
      isActive = false;
    };
  }, [id]);

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      try {
        setStatus("loading");
        setError("");
        const response = await fetchPostsInChannel({
          channelID: id,
          start,
          limit,
        });
        if (!isActive) return;
        setPosts(Array.isArray(response?.posts) ? response.posts : []);
        setMetadata(
          response?.metadata || { total: 0, start, end: start, limit },
        );
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        setStatus("error");
        setError(err.message || "Failed to load channel posts");
      }
    }

    loadPosts();

    return () => {
      isActive = false;
    };
  }, [id, start]);

  useEffect(() => {
    setDisplayPosts(posts);
  }, [posts]);

  const canPrev = metadata.start > 0;
  const canNext = metadata.end < metadata.total;

  function handlePrev() {
    if (!canPrev) return;
    setStart(Math.max(0, metadata.start - limit));
  }

  function handleNext() {
    if (!canNext) return;
    setStart(metadata.end);
  }

  async function handleLikePost(post) {
    if (!post) return;
    try {
      const userID = sessionStorage.getItem("userID");
      const result = await registerLike({
        parentID: post.postID,
        userID,
        likeNotation: 1,
        likeType: "post",
      });
      if (result?.message !== "Like removed") {
        setDisplayPosts((prev) =>
          prev.filter((item) => item.postID !== post.postID),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDislikePost(post) {
    if (!post) return;
    try {
      const userID = sessionStorage.getItem("userID");
      const result = await registerLike({
        parentID: post.postID,
        userID,
        likeNotation: -1,
        likeType: "post",
      });
      if (result?.message !== "Like removed") {
        setDisplayPosts((prev) =>
          prev.filter((item) => item.postID !== post.postID),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  const bannerImage = channel?.bannerImage;
  const channelName = channel?.channelName || "Channel";
  const bannerStyle = bannerImage
    ? { backgroundImage: `url(${bannerImage})` }
    : {
        backgroundImage:
          "linear-gradient(135deg, #101214 0%, #3b1d2c 50%, #8b3a2b 100%)",
      };
  const initials = channelName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <div className="channel-detail">
      <div className="channel-detail__content">
        <Sidebar />
        <main className="channel-detail__main">
          <ProfileCard />

          <section
            className={`channel-detail__banner${bannerImage ? "" : " channel-detail__banner--fallback"}`}
            style={bannerStyle}
          >
            <div className="channel-detail__overlay">
              <p className="channel-detail__eyebrow">Channel</p>
              <h1 className="channel-detail__title">#{channelName}</h1>
              <p className="channel-detail__subtitle">
                {channel?.channelDescription ||
                  "Anonymous stories and honest replies."}
              </p>
            </div>
            {!bannerImage ? (
              <div className="channel-detail__initials" aria-hidden="true">
                {initials || "RD"}
              </div>
            ) : null}
          </section>
          <div className="channel-detail__actions">
          <button
  type="button"
  className="channel-detail__create-post"
  onClick={() => {
    sessionStorage.setItem("channelID", id);
    navigate("/create");
  }}
>
  Create Post
</button>
</div>
          <p className="channel-detail__meta">
            Showing {metadata.start}...{metadata.end} of {metadata.total} posts
          </p>

          {status === "loading" ? (
            <p className="channel-detail__status">Loading channel posts...</p>
          ) : null}
          {status === "error" ? (
            <p className="channel-detail__status channel-detail__status--error">
              {error}
            </p>
          ) : null}

          {status === "success" ? (
            <PostStack
              posts={displayPosts}
              canPrev={canPrev}
              canNext={canNext}
              onPrev={handlePrev}
              onNext={handleNext}
              onOpenPost={(post) => setActivePostID(post.postID)}
              onLike={handleLikePost}
              onDislike={handleDislikePost}
            />
          ) : null}
        </main>
      </div>
       {/* <Footer /> */}
      <PostModal postID={activePostID} onClose={() => setActivePostID(null)} />
    </div>
  );
}
