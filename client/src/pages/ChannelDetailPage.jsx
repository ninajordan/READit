import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchChannelWithPosts } from "../features/channels/channelsApi.js";

export default function ChannelDetailPage() {
  const { id } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChannel() {
      try {
        const response = await fetchChannelWithPosts(id);
        setChannelData(response?.channelData || null);
        sessionStorage.setItem("channelID", id);
      } catch (err) {
        setError(err.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    }

    loadChannel();
  }, [id]);

  if (loading) return <p>Loading channel...</p>;
  if (error) return <p>{error}</p>;
  if (!channelData) return <p>No channel found.</p>;

  return (
    <main>
      <h1>#{channelData.channel?.channelName}</h1>
      <p>{channelData.channel?.channelDescription}</p>

      <section>
        {channelData.posts?.length ? (
          channelData.posts.map((post) => (
            <article key={post.postID || post._id}>
              <h3>{post.postTitle || post.title || "Untitled Post"}</h3>
              <p>{post.postBody || post.body || post.content}</p>
            </article>
          ))
        ) : (
          <p>No posts in this channel yet.</p>
        )}
      </section>
    </main>
  );
}