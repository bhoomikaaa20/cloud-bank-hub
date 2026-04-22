import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, Receipt, DollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Meridian Bank" }] }),
  component: () => <RequireAuth requireAdmin><Admin /></RequireAuth>,
});

interface Profile { id: string; full_name: string; email: string; created_at: string; }
interface Tx { id: string; sender_id: string | null; receiver_id: string | null; amount: number; created_at: string; }

function Admin() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [tab, setTab] = useState<"users" | "transactions">("users");

  const load = async () => {
    const [{ data: u }, { data: t }, { data: a }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("accounts").select("balance"),
    ]);
    setUsers(u ?? []);
    setTxs(t ?? []);
    setTotalBalance((a ?? []).reduce((s, x) => s + Number(x.balance), 0));
  };

  useEffect(() => { load(); }, []);

  const nameOf = (id: string | null) => (id ? users.find((u) => u.id === id)?.full_name ?? "—" : "—");

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user and all their data?")) return;
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("User deleted"); load(); }
  };

  const deleteTx = async (id: string) => {
    if (!confirm("Delete this transaction record?")) return;
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Transaction deleted"); load(); }
  };

  const stats = [
    { icon: Users, label: "Total Users", value: users.length },
    { icon: Receipt, label: "Total Transactions", value: txs.length },
    { icon: DollarSign, label: "System Balance", value: `$${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-bold mb-6">Admin Console</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-serif font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-muted p-1 rounded-md w-fit mb-4">
          <Button size="sm" variant={tab === "users" ? "default" : "ghost"} onClick={() => setTab("users")}>Users</Button>
          <Button size="sm" variant={tab === "transactions" ? "default" : "ghost"} onClick={() => setTab("transactions")}>Transactions</Button>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {tab === "users" ? (
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Joined</th><th className="p-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-medium">{u.full_name}</td>
                    <td className="p-3 text-muted-foreground">{u.email}</td>
                    <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => deleteUser(u.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr><th className="p-3">From</th><th className="p-3">To</th><th className="p-3">Amount</th><th className="p-3">Date</th><th className="p-3"></th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {txs.map((t) => (
                  <tr key={t.id}>
                    <td className="p-3">{nameOf(t.sender_id)}</td>
                    <td className="p-3">{nameOf(t.receiver_id)}</td>
                    <td className="p-3 font-semibold">${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-muted-foreground">{new Date(t.created_at).toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => deleteTx(t.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
