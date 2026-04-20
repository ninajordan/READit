import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../features/posts/createPostApi.js";
import { useChannels } from "../features/channels/useChannels.js";
import "./CreatePostForm.css";

const MIN_TITLE_LENGTH = 20;
const MAX_BODY_LENGTH = 3000;

export default function CreatePostForm({ initialChannelID }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channelID, setChannelID] = useState(initialChannelID || "");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { channels } = useChannels();
  const trimmedTitle = title.trim();
  const trimmedBody = body.trim();
  const titleCharacterCount = trimmedTitle.length;
  const bodyCharacterCount = body.length;
  const isTitleTooShort =
    titleCharacterCount > 0 && titleCharacterCount < MIN_TITLE_LENGTH;
  const isBodyTooLong = bodyCharacterCount > MAX_BODY_LENGTH;
  const isFormInvalid =
    !trimmedTitle ||
    !trimmedBody ||
    titleCharacterCount < MIN_TITLE_LENGTH ||
    isBodyTooLong;

  async function handleSubmit(event) {
    event.preventDefault();

    if (!trimmedTitle || !trimmedBody) {
      setError("Title and body are required.");
      return;
    }

    if (titleCharacterCount < MIN_TITLE_LENGTH) {
      setError(`Post title must be at least ${MIN_TITLE_LENGTH} characters.`);
      return;
    }

    if (isBodyTooLong) {
      setError(`Post body cannot exceed ${MAX_BODY_LENGTH} characters.`);
      return;
    }

    try {
      setStatus("loading");
      setError("");

      const posterID = sessionStorage.getItem("userID");
      const posterName = sessionStorage.getItem("user_anonymity");

      await createPost({
        postTitle: title.trim(),
        postBody: body.trim(),
        channelID,
        posterID,
        posterName,
      });

      // redirect to the channel where the post was made - P. 4 change
      navigate(`/channels/${channelID}`);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to create post.");
    }
  }

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      {!initialChannelID && (
        <>
          <label className="create-post__label">Select Channel</label>
          <select
            className="create-post__input"
            value={channelID}
            onChange={(e) => setChannelID(e.target.value)}
          >
            <option value="">-- Choose a channel --</option>
            {channels.map((c) => {
              const id = c.channelID || c._id || c.id;
              const name = c.channelName || c.name;
              return (
                <option key={id} value={id}>
                  #{name}
                </option>
              );
            })}
          </select>
        </>
      )}

      <label className="create-post__label">Title</label>
      <input
        className="create-post__input"
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
          setError("");
        }}
      />
      <p
        className={`create-post__counter ${
          isTitleTooShort ? "create-post__counter--invalid" : ""
        }`}
      >
        {titleCharacterCount}/{MIN_TITLE_LENGTH} characters minimum
      </p>

      <label className="create-post__label">Body</label>
      <textarea
        className="create-post__textarea"
        rows={6}
        value={body}
        onChange={(event) => {
          setBody(event.target.value);
          setError("");
        }}
      />
      <p
        className={`create-post__counter ${
          isBodyTooLong ? "create-post__counter--invalid" : ""
        }`}
      >
        {bodyCharacterCount}/{MAX_BODY_LENGTH} characters
      </p>

      <button
        className="create-post__button"
        type="submit"
        disabled={status === "loading" || isFormInvalid}
      >
        {status === "loading" ? "Posting..." : "Submit"}
      </button>

      {error && <p className="create-post__error">{error}</p>}
    </form>
  );
}
