
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Meridian Bank" }] }),
  component: () => <RequireAuth><Notifications /></RequireAuth>,
});

interface Notif {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
}

function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ Get all notifications
        const res = await fetch("http://localhost:5000/api/notifications", {
          headers: {
            Authorization: `Bearer ${token} `,
          },
        });

        const data = await res.json();
        setItems(data);

        // ✅ Mark all as read
        await fetch("http://localhost:5000/api/notifications/read-all", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token} `,
          },
        });

      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-6">Notifications</h1>

        <div
          className="bg-card border border-border rounded-lg divide-y divide-border"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {items.length === 0 && (
            <p className="p-8 text-center text-muted-foreground">
              No notifications yet.
            </p>
          )}

          {items.map((n) => (
            <div key={n.id} className="p-4 flex items-start gap-3">
              <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

