import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";

export function RequireAuth({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { user, role, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) nav({ to: "/login" });
    else if (requireAdmin && role !== "admin") nav({ to: "/dashboard" });
  }, [user, role, loading, requireAdmin, nav]);

  if (loading || !user || (requireAdmin && role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  return <>{children}</>;
}
