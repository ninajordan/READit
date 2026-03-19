import PostCard from "./PostCard.jsx";
import "./PostGrid.css";

export default function PostGrid({ posts, onOpenPost }) {
  if (!posts || posts.length === 0) {
    return <p className="post-grid__empty">No liked posts yet.</p>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <div key={post.postID} className="post-grid__item">
          <PostCard
            post={post}
            isActive={false}
            onSelect={() => onOpenPost?.(post)}
          />
        </div>
      ))}
    </div>
  );
}
