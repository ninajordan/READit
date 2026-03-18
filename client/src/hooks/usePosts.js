import { useEffect, useState } from "react";
import { fetchAllPosts } from "../features/posts/postsApi.js";

export function usePosts({ start = 0, limit = 20 } = {}) {
  const [posts, setPosts] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, start: 0, end: 0, limit });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadPosts() {
      try {
        setStatus("loading");
        setError("");
        const data = await fetchAllPosts({ start, limit });
        if (!isActive) return;
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setMetadata(
          data.metadata || { total: 0, start: start, end: start, limit: limit }
        );
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        setStatus("error");
        setError(err.message || "Failed to load posts");
      }
    }

    loadPosts();

    return () => {
      isActive = false;
    };
  }, [start, limit]);

  return { posts, metadata, status, error };
}
