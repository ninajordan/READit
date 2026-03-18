import { useState } from "react";
import "./CreateComment.css";

export default function CreateComment({ onSubmit, isSubmitting = false }) {
  const [value, setValue] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    await onSubmit?.(trimmed);
    setValue("");
  }

  return (
    <form className="create-comment" onSubmit={handleSubmit}>
      <input
        className="create-comment__input"
        placeholder="Post your comment"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={isSubmitting}
      />
      <button type="submit" className="create-comment__button" disabled={isSubmitting}>
        {isSubmitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
