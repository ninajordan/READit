export async function fetchCreatedPosts(userID) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(
    `${baseUrl}/api/posts/get-created-posts/${userID}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load created posts");
  }

  return response.json();
}
