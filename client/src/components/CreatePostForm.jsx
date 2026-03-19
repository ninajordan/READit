import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../features/posts/createPostApi.js";
import "./CreatePostForm.css";

export default function CreatePostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      setError("Title and body are required.");
      return;
    }

    try {
      setStatus("loading");
      setError("");
      setSuccess("");

      const channelID = sessionStorage.getItem("channelID") || "-1";
      const posterID = sessionStorage.getItem("userID");
      const posterName = sessionStorage.getItem("user_anonymity");

      await createPost({
        postTitle: trimmedTitle,
        postBody: trimmedBody,
        channelID,
        posterID,
        posterName,
      });

      setSuccess("Post created successfully.");
      setTitle("");
      setBody("");
      setStatus("success");
      navigate("/");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to create post.");
    }
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <label className="create-post__label" htmlFor="post-title">
        Title
      </label>
      <input
        id="post-title"
        className="create-post__input"
        placeholder="Enter title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label className="create-post__label" htmlFor="post-body">
        Body
      </label>
      <textarea
        id="post-body"
        className="create-post__textarea"
        placeholder="Write your post"
        rows={6}
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      <button
        className="create-post__button"
        type="submit"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Posting..." : "Submit"}
      </button>
      {error ? <p className="create-post__error">{error}</p> : null}
      {success ? <p className="create-post__success">{success}</p> : null}
    </form>
  );
}
