import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx"; // footer removed p.4 change
import ProfileCard from "../components/ProfileCard.jsx";
import PostGrid from "../components/PostGrid.jsx";
import PostModal from "../components/PostModal.jsx";
import { useLikedPosts } from "../hooks/useLikedPosts.js";
import { useCreatedPosts } from "../hooks/useCreatedPosts.js";
import "./ProfilePage.css";

export default function ProfilePage() {
  const userID = sessionStorage.getItem("userID");
  const {
    posts: likedPosts,
    status: likedStatus,
    error: likedError,
  } = useLikedPosts(userID);
  const {
    posts: createdPosts,
    status: createdStatus,
    error: createdError,
  } = useCreatedPosts(userID);
  const [activePostID, setActivePostID] = useState(null);

  return (
    <div className="profile-page">
      <div className="profile-page__content">
        <Sidebar />
        <main className="profile-page__main">
          <ProfileCard />
          <section className="profile-page__header">
            <h1 className="profile-page__title">Liked posts</h1>
            <p className="profile-page__subtitle">
              Everything you have liked so far.
            </p>
          </section>

          {likedStatus === "loading" ? (
            <p className="profile-page__note">Loading liked posts...</p>
          ) : null}
          {likedStatus === "error" ? (
            <p className="profile-page__note">{likedError}</p>
          ) : null}
          {likedStatus === "success" ? (
            <PostGrid
              posts={likedPosts}
              onOpenPost={(post) => setActivePostID(post.postID)}
              emptyMessage="No liked posts yet."
            />
          ) : null}

          <section className="profile-page__header profile-page__header--secondary">
            <h2 className="profile-page__title profile-page__title--section">
              Posts Created by you
            </h2>
            <p className="profile-page__subtitle">
              Your anonymous posts, all in one place.
            </p>
          </section>

          {createdStatus === "loading" ? (
            <p className="profile-page__note">Loading created posts...</p>
          ) : null}
          {createdStatus === "error" ? (
            <p className="profile-page__note">{createdError}</p>
          ) : null}
          {createdStatus === "success" ? (
            <PostGrid
              posts={createdPosts}
              onOpenPost={(post) => setActivePostID(post.postID)}
              emptyMessage="No created posts yet."
            />
          ) : null}
        </main>
      </div>
      {/* <Footer /> */}
      <PostModal postID={activePostID} onClose={() => setActivePostID(null)} />
    </div>
  );
}
