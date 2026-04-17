import { useEffect, useMemo, useRef, useState } from "react";
import PostCard from "./PostCard.jsx";
import "./PostStack.css";

export default function PostStack({
  posts,
  onOpenPost,
  onLike,
  onDislike,
}) {
  const [index, setIndex] = useState(0);
  const startX = useRef(null);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const swipeTimer = useRef(null);

  useEffect(() => {
    setIndex(0);
    setSwipeDirection(null);
    if (swipeTimer.current) {
      clearTimeout(swipeTimer.current);
      swipeTimer.current = null;
    }
  }, [posts]);

  const visiblePosts = useMemo(() => {
    if (!posts || posts.length === 0) return [];
    const stack = [];
    const count = Math.min(3, posts.length);

    for (let offset = 0; offset < count; offset += 1) {
      const item = posts[(index + offset) % posts.length];
      stack.push({ item, offset });
    }

    return stack;
  }, [posts, index]);

  function goNext() {
    setIndex((current) => (current + 1) % posts.length);
  }

  function goPrev() {
    setIndex((current) => (current - 1 + posts.length) % posts.length);
  }

  function triggerSwipe(direction, action) {
    if (!posts || posts.length === 0) return;
    if (swipeDirection) return;

    setSwipeDirection(direction);
    swipeTimer.current = setTimeout(async () => {
      await action?.();
      setSwipeDirection(null);
    }, 220);
  }

  function handlePointerDown(event) {
    startX.current = event.clientX;
  }

  function handlePointerUp(event) {
    if (startX.current === null) return;

    const delta = event.clientX - startX.current;
    if (delta < -80) {
      goNext();
    } else if (delta > 80) {
      goPrev();
    }

    startX.current = null;
  }

  if (!posts || posts.length === 0) {
    return <p className="post-stack__empty">No posts available.</p>;
  }

  return (
    <section className="post-stack">
      <div className="post-stack__frame">
        <button
          type="button"
          className="post-stack__arrow"
          onClick={goPrev}
          aria-label="Previous post"
        >
          &lt;
        </button>

        <div
          className="post-stack__cards"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          {visiblePosts.map(({ item, offset }) => (
            <div
              key={`${item.postID}-${offset}`}
              className={`post-stack__card post-stack__card--${offset}${
                offset === 0 && swipeDirection
                  ? ` post-stack__card--swipe-${swipeDirection}`
                  : ""
              }`}
            >
              <PostCard
                post={item}
                isActive={offset === 0}
                onSelect={() => onOpenPost?.(item)}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="post-stack__arrow"
          onClick={goNext}
          aria-label="Next post"
        >
          &gt;
        </button>
      </div>

      <div className="post-stack__actions">
        <button
          type="button"
          className="post-stack__button"
          onClick={() => triggerSwipe("right", () => onLike?.(posts[index]))}
          disabled={!!swipeDirection}
        >
          Like
        </button>

        <button
          type="button"
          className="post-stack__button post-stack__button--ghost"
          onClick={goNext}
        >
          Skip
        </button>

        <button
          type="button"
          className="post-stack__button"
          onClick={() => triggerSwipe("left", () => onDislike?.(posts[index]))}
          disabled={!!swipeDirection}
        >
          Dislike
        </button>
      </div>
    </section>
  );
}
