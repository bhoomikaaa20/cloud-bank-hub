import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Landmark } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — Meridian Bank" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-16 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-xl p-8" style={{ boxShadow: "var(--shadow-elegant)" }}>
            <div className="flex justify-center mb-6">
              <div className="h-12 w-12 rounded-md flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
                <Landmark className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl font-serif font-bold text-center mb-2">Welcome back</h1>
            <p className="text-center text-sm text-muted-foreground mb-8">Sign in to your Meridian account</p>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "Signing in..." : "Sign In"}</Button>
            </form>
            <p className="text-sm text-center mt-6 text-muted-foreground">
              No account? <Link to="/signup" className="text-primary font-semibold hover:underline">Open one now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
