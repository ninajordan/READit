import PostCard from "./PostCard.jsx";
import "./PostGrid.css";

export default function PostGrid({
  posts,
  onOpenPost,
  emptyMessage = "No posts yet.",
  action,
  highlightedIndex = null,
  indexOffset = 0,
  onHighlightChange,
  getCardRef,
}) {
  if (!posts || posts.length === 0) {
    return <p className="post-grid__empty">{emptyMessage}</p>;
  }

  return (
    <div className="post-grid">
      {posts.map((post, index) => {
        const absoluteIndex = indexOffset + index;

        return (
        <div key={post.postID} className="post-grid__item">
          <PostCard
            post={post}
            isActive={false}
            isHighlighted={highlightedIndex === absoluteIndex}
            onSelect={() => onOpenPost?.(post)}
            onFocus={() => onHighlightChange?.(absoluteIndex)}
            cardRef={getCardRef?.(absoluteIndex)}
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
        );
      })}
    </div>
  );
}
