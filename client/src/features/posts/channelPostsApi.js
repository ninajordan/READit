export async function fetchPostsInChannel({
  channelID,
  start = 0,
  limit = 20,
}) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(
    `${baseUrl}/api/posts/get-posts-in-channel/${channelID}?start=${start}&limit=${limit}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load channel posts");
  }

  return response.json();
}
