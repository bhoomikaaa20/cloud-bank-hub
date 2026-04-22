import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Send, Search } from "lucide-react";

export const Route = createFileRoute("/transfer")({
  head: () => ({ meta: [{ title: "Transfer — Meridian Bank" }] }),
  component: () => <RequireAuth><Transfer /></RequireAuth>,
});

interface SearchResult { account_number: string; account_name: string; user_id: string; full_name: string; }

function Transfer() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [balance, setBalance] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("accounts").select("balance").eq("user_id", user.id).order("created_at").limit(1).single()
      .then(({ data }) => setBalance(Number(data?.balance ?? 0)));
  }, [user]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .neq("id", user!.id)
        .limit(5);
      if (!profiles?.length) { setResults([]); return; }
      const ids = profiles.map((p) => p.id);
      const { data: accts } = await supabase
        .from("accounts")
        .select("user_id, account_number, account_name")
        .in("user_id", ids);
      const merged: SearchResult[] = (accts ?? []).map((a) => {
        const p = profiles.find((p) => p.id === a.user_id)!;
        return { account_number: a.account_number, account_name: a.account_name, user_id: a.user_id, full_name: p.full_name };
      });
      setResults(merged);
    }, 250);
    return () => clearTimeout(t);
  }, [query, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > balance) return toast.error("Insufficient balance");
    setLoading(true);
    const { error } = await supabase.rpc("transfer_funds", {
      _receiver_account: accountNumber.trim(),
      _amount: amt,
      _note: note || undefined,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Transaction successful");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <h1 className="text-3xl font-serif font-bold mb-2">Send money</h1>
        <p className="text-muted-foreground mb-8">Available balance: <span className="font-semibold text-foreground">${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></p>

        <div className="bg-card border border-border rounded-xl p-8" style={{ boxShadow: "var(--shadow-card)" }}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label>Find recipient (name or email)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search users..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              {results.length > 0 && (
                <div className="mt-2 border border-border rounded-md divide-y divide-border bg-background">
                  {results.map((r) => (
                    <button type="button" key={r.account_number} onClick={() => { setAccountNumber(r.account_number); setQuery(r.full_name); setResults([]); }}
                      className="w-full text-left p-3 hover:bg-muted transition-colors">
                      <p className="font-medium text-sm">{r.full_name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{r.account_number} · {r.account_name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="acct">Recipient account number</Label>
              <Input id="acct" required value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="12-digit account number" className="font-mono" />
            </div>

            <div>
              <Label htmlFor="amt">Amount (USD)</Label>
              <Input id="amt" type="number" step="0.01" min="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            </div>

            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder="What's it for?" />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              <Send className="h-4 w-4 mr-2" />{loading ? "Sending..." : "Send Transfer"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
