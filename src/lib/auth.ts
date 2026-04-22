import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "admin" | "user";

export interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(() => loadRole(s.user.id), 0);
      } else {
        setRole(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadRole(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    async function loadRole(uid: string) {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      const roles = (data ?? []).map((r) => r.role as AppRole);
      setRole(roles.includes("admin") ? "admin" : roles[0] ?? "user");
    }

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, session, role, loading };
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}
