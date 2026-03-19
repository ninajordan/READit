export async function logoutUser() {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const response = await fetch(`${baseUrl}/api/users/logout`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Logout failed");
  }

  return response.json();
}
