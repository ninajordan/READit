export async function fetchAllPosts({ start = 0, limit = 20 } = {}) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(
    `${baseUrl}/api/posts/get-all-posts?start=${start}&limit=${limit}`,
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load posts");
  }

  return response.json();
}
