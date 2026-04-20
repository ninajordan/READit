import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../features/posts/createPostApi.js";
import { useChannels } from "../features/channels/useChannels.js";
import "./CreatePostForm.css";

export default function CreatePostForm({ initialChannelID }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [channelID, setChannelID] = useState(initialChannelID || "");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { channels } = useChannels();

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
        onChange={(event) => setTitle(event.target.value)}
      />

      <label className="create-post__label">Body</label>
      <textarea
        className="create-post__textarea"
        rows={6}
        value={body}
        onChange={(event) => setBody(event.target.value)}
      />

      <button className="create-post__button" type="submit">
        {status === "loading" ? "Posting..." : "Submit"}
      </button>

      {error && <p className="create-post__error">{error}</p>}
    </form>
  );
}
