import { useEffect, useState } from "react";

export type AppRole = "admin" | "user";

export interface AuthState {
  user: any | null;
  role: AppRole | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setRole(data.user.role);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setLoading(false);
      });
  }, []);

  return { user, role, loading };
}

export function signOut() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}