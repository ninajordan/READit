import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import PostGrid from "../components/PostGrid.jsx";
import PostModal from "../components/PostModal.jsx";
import { useLikedPosts } from "../hooks/useLikedPosts.js";
import "./ProfilePage.css";

export default function ProfilePage() {
  const userID = sessionStorage.getItem("userID");
  const { posts, status, error } = useLikedPosts(userID);
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

          {status === "loading" ? (
            <p className="profile-page__note">Loading liked posts...</p>
          ) : null}
          {status === "error" ? (
            <p className="profile-page__note">{error}</p>
          ) : null}
          {status === "success" ? (
            <PostGrid
              posts={posts}
              onOpenPost={(post) => setActivePostID(post.postID)}
            />
          ) : null}
        </main>
      </div>
      <Footer />
      <PostModal postID={activePostID} onClose={() => setActivePostID(null)} />
    </div>
  );
}
