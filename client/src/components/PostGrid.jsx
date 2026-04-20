import PostCard from "./PostCard.jsx";
import "./PostGrid.css";

export default function PostGrid({
  posts,
  onOpenPost,
  emptyMessage = "No posts yet.",
  action,
}) {
  if (!posts || posts.length === 0) {
    return <p className="post-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="post-grid">
      {posts.map((post) => (
        <div key={post.postID} className="post-grid__item">
          <PostCard
            post={post}
            isActive={false}
            onSelect={() => onOpenPost?.(post)}
            action={
              action
                ? {
                    ...action,
                    onClick: () => action.onClick?.(post),
                  }
                : null
            }
          />
        </div>
      ))}
    </div>
  );
}
