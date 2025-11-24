export type UserRole = "survival" | "admin" | "nikita";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  accessToken: string;
}

export async function login(username: string, password: string): Promise<User> {
  const response = await fetch("/api/v1/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Authentication failed. Check provided credentials.");
  }
}

export async function me(): Promise<User> {
  const response = await fetch("/api/v1/users/me", { method: "POST" });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Request failed");
  }
}

export async function logout(): Promise<boolean> {
  const response = await fetch("/api/v1/users/logout", { method: "POST" });

  if (response.ok) {
    return true;
  } else {
    throw new Error("Logout failed");
  }
}
