const BASE_URL = import.meta.env.VITE_API_URL || "";
const CHANNELS_API_BASE = `${BASE_URL}/api/channels`;

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = "Request failed";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchChannels({ search = "", category = "" } = {}) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const url = params.toString()
    ? `${CHANNELS_API_BASE}?${params.toString()}`
    : CHANNELS_API_BASE;

  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchHomepageChannels() {
  const response = await fetch(`${CHANNELS_API_BASE}/homepage`);
  return handleResponse(response);
}

export async function fetchChannelById(id) {
  const response = await fetch(`${CHANNELS_API_BASE}/${id}`);
  return handleResponse(response);
}

export async function fetchChannelWithPosts(id) {
  const response = await fetch(`${CHANNELS_API_BASE}/${id}/posts`);
  return handleResponse(response);
}

export async function createChannel(channelData) {
  const response = await fetch(CHANNELS_API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channelData),
  });

  return handleResponse(response);
}

export async function updateChannel(id, updates) {
  const response = await fetch(`${CHANNELS_API_BASE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return handleResponse(response);
}

export async function deleteChannel(id) {
  const response = await fetch(`${CHANNELS_API_BASE}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response);
}