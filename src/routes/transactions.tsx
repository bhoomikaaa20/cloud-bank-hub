import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — Meridian Bank" }] }),
  component: () => <RequireAuth><Transactions /></RequireAuth>,
});

interface Tx { id: string; sender_id: string | null; receiver_id: string | null; amount: number; note: string | null; created_at: string; status: string; }

function Transactions() {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");
  const [search, setSearch] = useState("");
  const [names, setNames] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("transactions").select("*").or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`).order("created_at", { ascending: false });
      const list = data ?? [];
      setTxs(list);
      const ids = Array.from(new Set(list.flatMap((t) => [t.sender_id, t.receiver_id]).filter(Boolean) as string[]));
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
        const map: Record<string, string> = {};
        (profs ?? []).forEach((p) => { map[p.id] = p.full_name; });
        setNames(map);
      }
    })();
  }, [user]);

  const filtered = txs.filter((t) => {
    const isOut = t.sender_id === user!.id;
    if (filter === "credit" && isOut) return false;
    if (filter === "debit" && !isOut) return false;
    if (search) {
      const q = search.toLowerCase();
      const other = isOut ? t.receiver_id : t.sender_id;
      const otherName = (other && names[other]) || "";
      if (!otherName.toLowerCase().includes(q) && !(t.note ?? "").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif font-bold mb-6">Transaction History</h1>
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-1 bg-muted p-1 rounded-md">
            {(["all", "credit", "debit"] as const).map((f) => (
              <Button key={f} size="sm" variant={filter === f ? "default" : "ghost"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
            ))}
          </div>
          <Input placeholder="Search by name or note..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="divide-y divide-border">
            {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground">No transactions found.</p>}
            {filtered.map((t) => {
              const isOut = t.sender_id === user!.id;
              const otherId = isOut ? t.receiver_id : t.sender_id;
              const otherName = (otherId && names[otherId]) || "Unknown";
              return (
                <div key={t.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${isOut ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}>
                      {isOut ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownLeft className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{isOut ? `To ${otherName}` : `From ${otherName}`}</p>
                      <p className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}{t.note ? ` · ${t.note}` : ""}</p>
                    </div>
                  </div>
                  <p className={`font-semibold whitespace-nowrap ${isOut ? "text-destructive" : "text-success"}`}>
                    {isOut ? "-" : "+"}${Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
