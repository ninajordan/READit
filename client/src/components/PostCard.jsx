import "./PostCard.css";

export default function PostCard({ post, isActive, onSelect, action }) {
  return (
    <article
      className={`post-card${isActive ? " post-card--active" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(post)}
      onKeyDown={(event) => {
        if (event.key === "Enter") onSelect?.(post);
      }}
    >
      {action ? (
        <button
          type="button"
          className="post-card__action"
          aria-label={action.label}
          onClick={(event) => {
            event.stopPropagation();
            action.onClick?.(post);
          }}
        >
          {action.icon}
        </button>
      ) : null}
      <p className="post-card__poster">{post.posterName || "Anonymous"}</p>
      <h3 className="post-card__title">{post.postTitle}</h3>
      <p className="post-card__preview">{post.preview}</p>
    </article>
  );
}
