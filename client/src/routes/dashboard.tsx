import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Send, Plus, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Meridian Bank" }] }),
  component: () => <RequireAuth><Dashboard /></RequireAuth>,
});

interface Account { id: string; account_name: string; account_number: string; balance: number; }
interface Tx { id: string; sender_id: string | null; receiver_id: string | null; amount: number; note: string | null; created_at: string; }

function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recent, setRecent] = useState<Tx[]>([]);
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  // ONLY LOGIC CHANGED — UI untouched

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");

        const [accRes, txRes, profileRes] = await Promise.all([
          fetch("http://localhost:5000/api/accounts", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/transactions/recent", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const accountsData = await accRes.json();
        const txData = await txRes.json();
        const profileData = await profileRes.json();

        setAccounts(accountsData);
        setRecent(txData);
        setProfile({ full_name: profileData.user.name });

      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, [user]);

  const total = accounts.reduce((s, a) => s + Number(a.balance), 0);

  const createAccount = async () => {
    const name = prompt("Account name (e.g. Savings)");
    if (!name) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ account_name: name }),
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      toast.success("Account created with $0 balance");

      // reload
      window.location.reload();

    } catch {
      toast.error("Failed to create account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <h1 className="text-3xl font-serif font-bold">{profile?.full_name ?? "Customer"}</h1>
        </div>

        <div className="rounded-2xl p-8 mb-8 text-primary-foreground" style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-elegant)" }}>
          <p className="text-sm uppercase tracking-widest text-primary-foreground/70 mb-2">Total Balance</p>
          <p className="text-5xl font-serif font-bold mb-6">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <div className="flex gap-3">
            <Link to="/transfer"><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Send className="h-4 w-4 mr-2" />Transfer</Button></Link>
            <Button variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={createAccount}>
              <Plus className="h-4 w-4 mr-2" />New Account
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Your accounts</h2>
            <div className="space-y-3">
              {accounts.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-lg p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{a.account_name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1 flex items-center gap-2">
                        {a.account_number}
                        <button onClick={() => { navigator.clipboard.writeText(a.account_number); toast.success("Copied"); }}>
                          <Copy className="h-3 w-3" />
                        </button>
                      </p>
                    </div>
                    <p className="text-2xl font-serif font-bold text-primary">${Number(a.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Recent activity</h2>
            <div className="bg-card border border-border rounded-lg divide-y divide-border" style={{ boxShadow: "var(--shadow-card)" }}>
              {recent.length === 0 && <p className="p-5 text-sm text-muted-foreground">No transactions yet.</p>}
              {recent.map((t) => {
                const isOut = t.sender_id === user!.id;
                return (
                  <div key={t.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center ${isOut ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                        {isOut ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{isOut ? "Transfer sent" : "Transfer received"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${isOut ? "text-destructive" : "text-success"}`}>
                      {isOut ? "-" : "+"}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
              {recent.length > 0 && (
                <Link to="/transactions" className="block p-3 text-center text-sm text-primary font-semibold hover:bg-muted">View all</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
