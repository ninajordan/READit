import Sidebar from "../components/Sidebar.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import PostStack from "../components/PostStack.jsx";
import { useEffect, useState } from "react";
import { usePosts } from "../hooks/usePosts.js";
import PostModal from "../components/PostModal.jsx";
import { registerLike } from "../features/likes/likesApi.js";
import "./HomePage.css";

export default function HomePage() {
  const [start, setStart] = useState(0);
  const [activePostID, setActivePostID] = useState(null);
  const limit = 20;
  const { posts, metadata, status, error } = usePosts({ start, limit });
  const [displayPosts, setDisplayPosts] = useState([]);
  const [seenAll, setSeenAll] = useState(false);

  useEffect(() => {
    setDisplayPosts(posts);
    setSeenAll(false);
  }, [posts]);

  const canPrev = metadata.start > 0;
  const canNext = metadata.end + 1 < metadata.total;

  function handlePrev() {
    if (!canPrev) return;
    setStart(Math.max(0, metadata.start - limit));
  }

  function handleNext() {
    if (!canNext) return;
    setStart(metadata.end + 1);
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

  useEffect(() => {
    if (displayPosts.length !== 0) return;
    if (status !== "success") return;

    if (metadata.end + 1 < metadata.total) {
      setStart(metadata.end + 1);
    } else if (metadata.total > 0) {
      setSeenAll(true);
    }
  }, [displayPosts, metadata.end, metadata.total, status]);

  return (
    <div className="home-page">
      <div className="home-page__content">
        <Sidebar />
        <main className="home-page__main">
          <ProfileCard />
          <section className="home-page__header">
            <div>
              <h1 className="home-page__title">
                Today&apos;s anonymous stories
              </h1>
              <p className="home-page__subtitle">
              All channels · Latest posts
              </p>
            </div>
            <p className="home-page__meta">
              Showing {metadata.start} to {metadata.end} of {metadata.total}{" "}
              posts
            </p>
          </section>

          {status === "loading" ? (
            <p className="home-page__status">Loading posts...</p>
          ) : null}

          {status === "error" ? (
            <p className="home-page__status home-page__status--error">
              {error}
            </p>
          ) : null}

          {status === "success" ? (
            <PostStack
              posts={displayPosts}
              onPrev={handlePrev}
              onNext={handleNext}
              canPrev={canPrev}
              canNext={canNext}
              keyboardEnabled={!activePostID}
              onOpenPost={(post) => setActivePostID(post.postID)}
              onLike={handleLikePost}
              onDislike={handleDislikePost}
            />
          ) : null}
        </main>
      </div>
      <PostModal postID={activePostID} onClose={() => setActivePostID(null)} />
    </div>
  );
}
