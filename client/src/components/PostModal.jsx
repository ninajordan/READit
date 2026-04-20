import { useEffect, useRef, useState } from "react";
import { fetchPostById } from "../features/posts/postDetailApi.js";
import { postComment } from "../features/comments/commentsApi.js";
import { registerLike } from "../features/likes/likesApi.js";
import CommentList from "../features/comments/CommentList.jsx";
import CreateComment from "../features/comments/CreateComment.jsx";
import "./PostModal.css";

export default function PostModal({ postID, onClose }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  async function loadPost() {
    try {
      setStatus("loading");
      setError("");
      const data = await fetchPostById(postID);
      setPost(data.postData?.post || null);
      setComments(data.postData?.comments || []);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to load post");
    }
  }

  useEffect(() => {
    let isActive = true;

    async function guardedLoad() {
      if (!isActive) return;
      await loadPost();
    }

    if (postID) {
      guardedLoad();
    }

    return () => {
      isActive = false;
    };
  }, [postID]);

  useEffect(() => {
    if (!postID) return;

    previouslyFocusedElementRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElementRef.current?.focus?.();
    };
  }, [onClose, postID]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  }

  async function handleSubmitComment(content) {
    try {
      setIsSubmitting(true);
      setError("");
      const userID = sessionStorage.getItem("userID");

      await postComment({
        commentData: content,
        post_id: postID,
        user_id: userID,
      });

      await loadPost();
    } catch (err) {
      setError(err.message || "Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLikePost() {
    try {
      const userID = sessionStorage.getItem("userID");
      await registerLike({
        parentID: postID,
        userID,
        likeNotation: 1,
        likeType: "post",
      });
      await loadPost();
    } catch (err) {
      setError(err.message || "Failed to like post");
    }
  }

  async function handleLikeComment(comment) {
    try {
      const userID = sessionStorage.getItem("userID");
      await registerLike({
        parentID: comment.commentID,
        userID,
        likeNotation: 1,
        likeType: "comment",
      });
      await loadPost();
    } catch (err) {
      setError(err.message || "Failed to like comment");
    }
  }

  if (!postID) return null;

  return (
    <div className="post-modal" onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        className="post-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Post details"
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="post-modal__close"
          onClick={onClose}
        >
          Close
        </button>
        {status === "loading" ? <p>Loading...</p> : null}
        {status === "error" ? (
          <p className="post-modal__error">{error}</p>
        ) : null}
        {status === "success" && post ? (
          <>
            <div className="post-modal__header">
              <div className="post-modal__poster-row">
                <p className="post-modal__poster">
                  {post.posterName || "Anonymous"}
                </p>
                <button
                  type="button"
                  className="post-modal__like"
                  onClick={handleLikePost}
                >
                  <span className="post-modal__heart">♥</span>
                  <span className="post-modal__likes">
                    {post.numLikes ?? 0}
                  </span>
                </button>
              </div>
              <h2 className="post-modal__title">{post.postTitle}</h2>
              <p className="post-modal__body">{post.postBody}</p>
            </div>
            <CreateComment
              onSubmit={handleSubmitComment}
              isSubmitting={isSubmitting}
            />
            <CommentList
              comments={comments}
              onLikeComment={handleLikeComment}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
