
import { Link, useRouter } from "@tanstack/react-router";
import { Landmark, LogOut, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, signOut } from "@/lib/auth";
import { useEffect, useState } from "react";

export function AppHeader() {
  const { user, role } = useAuth();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/notifications/unread-count",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store", // ✅ IMPORTANT
          }
        );

        const data = await res.json();
        setUnread(data.count || 0);

      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    load();

    const interval = setInterval(load, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const path = router.state.location.pathname;

  const link = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors hover:text-primary ${path === to ? "text-primary" : "text-muted-foreground"
        } `}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-40">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-md flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Landmark className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold text-primary">
            Meridian Bank
          </span>
        </Link>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-7">
            {link("/dashboard", "Dashboard")}
            {link("/transfer", "Transfer")}
            {link("/transactions", "Transactions")}
            {role === "admin" && link("/admin", "Admin")}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* Notifications */}
              <Link to="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Admin badge */}
              {role === "admin" && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded bg-accent/15 text-accent-foreground">
                  <Shield className="h-3 w-3" /> ADMIN
                </span>
              )}

              {/* Logout */}
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-1" /> Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Open Account</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

