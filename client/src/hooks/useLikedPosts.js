import { useEffect, useState } from "react";
import { fetchLikedPosts } from "../features/posts/likedPostsApi.js";

export function useLikedPosts(userID) {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadLikedPosts() {
      if (!userID) return;
      try {
        setStatus("loading");
        setError("");
        const data = await fetchLikedPosts(userID);
        if (!isActive) return;
        const liked = data.posts || data || [];
        setPosts(Array.isArray(liked) ? liked : []);
        setStatus("success");
      } catch (err) {
        if (!isActive) return;
        setStatus("error");
        setError(err.message || "Failed to load liked posts");
      }
    }

    loadLikedPosts();

    return () => {
      isActive = false;
    };
  }, [userID]);

  return { posts, status, error };
}
