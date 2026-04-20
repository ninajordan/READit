import { useEffect, useMemo, useRef, useState } from "react";
import PostCard from "./PostCard.jsx";
import "./PostStack.css";

export default function PostStack({
  posts,
  canPrev = false,
  canNext = false,
  onPrev,
  onNext,
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
    const count = Math.min(3, posts.length - index);

    for (let offset = 0; offset < count; offset += 1) {
      const item = posts[index + offset];
      stack.push({ item, offset });
    }

    return stack;
  }, [posts, index]);

  function goNext() {
    if (!posts || index >= posts.length - 1) return;
    setIndex((current) => current + 1);
  }

  function goPrev() {
    if (!posts || index <= 0) return;
    setIndex((current) => current - 1);
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

  const activePost = posts[index];
  const canSkip = index < posts.length - 1 && !swipeDirection;
  const canUsePrevArrow = typeof onPrev === "function" ? canPrev : index > 0;
  const canUseNextArrow = typeof onNext === "function" ? canNext : index < posts.length - 1;

  function handlePrevArrow() {
    if (typeof onPrev === "function") {
      if (!canPrev) return;
      onPrev();
      return;
    }

    goPrev();
  }

  function handleNextArrow() {
    if (typeof onNext === "function") {
      if (!canNext) return;
      onNext();
      return;
    }

    goNext();
  }

  return (
    <section className="post-stack">
      <div className="post-stack__frame">
        <button
          type="button"
          className="post-stack__arrow"
          onClick={handlePrevArrow}
          disabled={!canUsePrevArrow || !!swipeDirection}
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
          onClick={handleNextArrow}
          disabled={!canUseNextArrow || !!swipeDirection}
          aria-label="Next post"
        >
          &gt;
        </button>
      </div>

      <div className="post-stack__actions">
        <button
          type="button"
          className="post-stack__button"
          onClick={() => triggerSwipe("right", () => onLike?.(activePost))}
          disabled={!!swipeDirection}
        >
          Like
        </button>

        <button
          type="button"
          className="post-stack__button post-stack__button--ghost"
          onClick={() => triggerSwipe("up", goNext)}
          disabled={!canSkip}
        >
          Skip
        </button>

        <button
          type="button"
          className="post-stack__button"
          onClick={() => triggerSwipe("left", () => onDislike?.(activePost))}
          disabled={!!swipeDirection}
        >
          Dislike
        </button>
      </div>
    </section>
  );
}
