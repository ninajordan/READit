import "./CommentCard.css";

export default function CommentCard({ comment, onLike }) {
  return (
    <article className="comment-card">
      <div className="comment-card__header">
        <p className="comment-card__poster">
          {comment.posterName || comment.commentPoster || "Anonymous"}
        </p>
        <button type="button" className="comment-card__like" onClick={() => onLike?.(comment)}>
          <span className="comment-card__heart">♥</span>
          <span className="comment-card__likes">{comment.numLikes ?? 0}</span>
        </button>
      </div>
      <p className="comment-card__content">{comment.commentContent}</p>
    </article>
  );
}
