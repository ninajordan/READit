import { useEffect, useState } from "react";
import { fetchCreatedPosts } from "../features/posts/createdPostsApi.js";

export function useCreatedPosts(userID) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadCreatedPosts() {
      if (!userID) return;

      try {
        setStatus("loading");
        setError("");
        const data = await fetchCreatedPosts(userID);
        if (!isActive) return;
        const created = data.posts || data || [];
        setPosts(Array.isArray(created) ? created : []);
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        setStatus("error");
        setError(err.message || "Failed to load created posts");
      }
    }

    loadCreatedPosts();

    return () => {
      isActive = false;
    };
  }, [userID]);

  return { posts, status, error };
}
