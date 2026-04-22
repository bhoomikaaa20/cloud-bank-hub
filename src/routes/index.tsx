import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import { ShieldCheck, Zap, TrendingUp, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Bank — Trusted Digital Banking" },
      { name: "description", content: "Open an account, transfer funds, and manage your finances with confidence." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-6 py-24 md:py-32 text-primary-foreground relative">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-5">Established · Trusted · Secure</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-6">
              Banking built on <span className="italic text-accent">trust</span>, designed for today.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
              Open an account in minutes. Move money instantly. Track every transaction. All protected by enterprise-grade security.
            </p>
            <div className="flex gap-3">
              <Link to="/signup"><Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">Open Free Account</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">Sign In</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Instant Transfers", desc: "Move money to any account in seconds." },
            { icon: ShieldCheck, title: "Bank-Grade Security", desc: "Multi-layer encryption on every action." },
            { icon: TrendingUp, title: "Live Balance", desc: "Real-time updates as money moves." },
            { icon: Lock, title: "Private & Secure", desc: "Your data, your control. Always." },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-lg bg-card border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-6 text-sm text-muted-foreground text-center">
          © {new Date().getFullYear()} Meridian Bank. Simulated banking for demo purposes.
        </div>
      </footer>
    </div>
  );
}
