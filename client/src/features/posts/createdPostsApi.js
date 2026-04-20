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

export async function deletePost({ postID, userID }) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(`${baseUrl}/api/posts/delete-post?postID=${postID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID }),
  });

  if (!response.ok) {
    let message = "Failed to delete post";

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {
      const errorText = await response.text();
      message = errorText || message;
    }

    throw new Error(message);
  }

  return response.json();
}
