export async function createPost({
  postTitle,
  postBody,
  channelID,
  posterID,
  posterName,
}) {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const payload = {
    postTitle,
    postBody,
    posterID,
    posterName,
  };

  if (channelID) {
    payload.channelID = channelID;
  }

  const response = await fetch(`${baseUrl}/api/posts/create-a-post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create post");
  }

  return response.json();
}
