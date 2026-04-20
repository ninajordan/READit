import "./PostCard.css";

export default function PostCard({
  post,
  isActive,
  isHighlighted = false,
  onSelect,
  onFocus,
  action,
  cardRef,
  tabIndex = 0,
}) {
  return (
    <article
      ref={cardRef}
      className={`post-card${isActive ? " post-card--active" : ""}${
        isHighlighted ? " post-card--highlighted" : ""
      }`}
      role="button"
      tabIndex={tabIndex}
      onClick={() => onSelect?.(post)}
      onFocus={() => onFocus?.(post)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(post);
        }
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
