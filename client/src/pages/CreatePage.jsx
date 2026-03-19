import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import CreatePostForm from "../components/CreatePostForm.jsx";
import "./CreatePage.css";

export default function CreatePage() {
  return (
    <div className="create-page">
      <div className="create-page__content">
        <Sidebar />
        <main className="create-page__main">
          <ProfileCard />
          <section className="create-page__header">
            <h1 className="create-page__title">Create a new post</h1>
            <p className="create-page__subtitle">Share your story anonymously.</p>
          </section>
          <CreatePostForm />
        </main>
      </div>
      <Footer />
    </div>
  );
}
