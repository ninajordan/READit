export async function fetchPostById(postID) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(`${baseUrl}/api/posts/view-post/${postID}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load post");
  }

  return response.json();
}
