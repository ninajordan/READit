export async function fetchLikedPosts(userID) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(
    `${baseUrl}/api/posts/get-liked-posts/${userID}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load liked posts");
  }

  return response.json();
}
