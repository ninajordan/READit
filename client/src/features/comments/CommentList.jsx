import CommentCard from "./CommentCard.jsx";
import "./CommentList.css";

export default function CommentList({ comments, onLikeComment }) {
  if (!comments || comments.length === 0) {
    return <p className="comment-list__empty">No comments yet.</p>;
  }

  return (
    <div className="comment-list">
      {comments.map((comment) => (
        <CommentCard key={comment.commentID} comment={comment} onLike={onLikeComment} />
      ))}
    </div>
  );
}
