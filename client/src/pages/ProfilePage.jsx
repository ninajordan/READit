import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import PostGrid from "../components/PostGrid.jsx";
import PostModal from "../components/PostModal.jsx";
import { useLikedPosts } from "../hooks/useLikedPosts.js";
import { useCreatedPosts } from "../hooks/useCreatedPosts.js";
import { deletePost } from "../features/posts/createdPostsApi.js";
import "./ProfilePage.css";

export default function ProfilePage() {
  const userID = sessionStorage.getItem("userID");
  const { posts: likedPosts, status: likedStatus, error: likedError } =
    useLikedPosts(userID);
  const {
    posts: createdPosts,
    status: createdStatus,
    error: createdError,
  } = useCreatedPosts(userID);
  const [activePostID, setActivePostID] = useState(null);
  const [deleteError, setDeleteError] = useState("");

  async function handleDeletePost(post) {
    try {
      setDeleteError("");
      await deletePost({ postID: post.postID, userID });
      setActivePostID(null);
      window.location.reload();
    } catch (err) {
      setDeleteError(err.message || "Failed to delete post");
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-page__content">
        <Sidebar />
        <main className="profile-page__main">
          <ProfileCard />
          <section className="profile-page__section">
            <div className="profile-page__header">
              <h1 className="profile-page__title">Created posts</h1>
              <p className="profile-page__subtitle">
                Your published posts with quick delete access.
              </p>
            </div>

            {createdStatus === "loading" ? (
              <p className="profile-page__note">Loading created posts...</p>
            ) : null}
            {createdStatus === "error" ? (
              <p className="profile-page__note">{createdError}</p>
            ) : null}
            {deleteError ? (
              <p className="profile-page__note">{deleteError}</p>
            ) : null}
            {createdStatus === "success" ? (
              <PostGrid
                posts={createdPosts}
                emptyMessage="No created posts yet."
                onOpenPost={(post) => setActivePostID(post.postID)}
                action={{
                  label: "Delete post",
                  icon: (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                    >
                      <path
                        d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 7h2v8h-2v-8zm4 0h2v8h-2v-8zM7 10h2v8H7v-8zm1 11a2 2 0 0 1-2-2V8h12v11a2 2 0 0 1-2 2H8z"
                        fill="currentColor"
                      />
                    </svg>
                  ),
                  onClick: handleDeletePost,
                }}
              />
            ) : null}
          </section>

          <section className="profile-page__section">
            <div className="profile-page__header">
              <h2 className="profile-page__title">Liked posts</h2>
              <p className="profile-page__subtitle">
                Everything you have liked so far.
              </p>
            </div>

            {likedStatus === "loading" ? (
              <p className="profile-page__note">Loading liked posts...</p>
            ) : null}
            {likedStatus === "error" ? (
              <p className="profile-page__note">{likedError}</p>
            ) : null}
            {likedStatus === "success" ? (
              <PostGrid
                posts={likedPosts}
                emptyMessage="No liked posts yet."
                onOpenPost={(post) => setActivePostID(post.postID)}
              />
            ) : null}
          </section>
        </main>
      </div>
      <Footer />
      <PostModal postID={activePostID} onClose={() => setActivePostID(null)} />
    </div>
  );
}
