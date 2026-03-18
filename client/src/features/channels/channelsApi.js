export async function fetchHomepageChannels() {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(`${baseUrl}/api/channels/homepage`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to load channels");
  }

  return response.json();
}
