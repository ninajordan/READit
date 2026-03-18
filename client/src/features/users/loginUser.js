export async function loginUser(name) {
  const baseUrl = import.meta.env.VITE_API_URL || "";

  const response = await fetch(`${baseUrl}/api/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Login failed");
  }

  return response.json();
}
