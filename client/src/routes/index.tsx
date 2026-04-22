import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import {
  ShieldCheck,
  Zap,
  TrendingUp,
  Lock,
  Wallet,
  Users,
  Globe2,
  BarChart3,
  Quote,
  Check,
  ArrowRight,
  Building2,
  PiggyBank,
  CreditCard,
  HeadphonesIcon,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Bank — Trusted Digital Banking" },
      {
        name: "description",
        content:
          "Open an account, transfer funds, and manage your finances with confidence at Meridian Bank.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-6 py-24 md:py-32 text-primary-foreground relative">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-5">
              Established · Trusted · Secure
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] mb-6">
              Banking built on{" "}
              <span className="italic text-accent">trust</span>, designed for
              today.
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl leading-relaxed">
              Open an account in minutes. Move money instantly. Track every
              transaction. All protected by enterprise-grade security.
            </p>
            <div className="flex gap-3">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
                >
                  Open Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR / STATS */}
      <section className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "250K+", label: "Active Customers" },
            { value: "$4.2B", label: "Assets Managed" },
            { value: "99.99%", label: "Uptime SLA" },
            { value: "24/7", label: "Support" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-serif font-bold text-primary">
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1 tracking-wide uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
            Why Meridian
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Everything you need, nothing you don't.
          </h2>
          <p className="text-muted-foreground text-lg">
            Modern tools, classic reliability. Built for individuals and
            families who expect more from their bank.
          </p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Instant Transfers",
              desc: "Move money to any account in seconds.",
            },
            {
              icon: ShieldCheck,
              title: "Bank-Grade Security",
              desc: "Multi-layer encryption on every action.",
            },
            {
              icon: TrendingUp,
              title: "Live Balance",
              desc: "Real-time updates as money moves.",
            },
            {
              icon: Lock,
              title: "Private & Secure",
              desc: "Your data, your control. Always.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-lg bg-card border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                {f.title}
              </h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-14">
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
                Our Services
              </p>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                A full suite for every financial moment.
              </h2>
            </div>
            <p className="text-muted-foreground text-lg md:pt-12">
              From everyday checking to long-term savings, Meridian gives you
              the tools to manage, move, and grow your money — all in one
              elegant interface.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Wallet,
                title: "Personal Checking",
                desc: "No hidden fees. Unlimited transfers. Real-time balances always at hand.",
              },
              {
                icon: PiggyBank,
                title: "High-Yield Savings",
                desc: "Earn competitive interest with no minimums and no lockups.",
              },
              {
                icon: CreditCard,
                title: "Smart Cards",
                desc: "Virtual and physical cards with instant freeze and granular controls.",
              },
              {
                icon: Building2,
                title: "Business Banking",
                desc: "Multi-user access, team permissions, and detailed expense reporting.",
              },
              {
                icon: Globe2,
                title: "Global Transfers",
                desc: "Send funds across borders with transparent rates and fees.",
              },
              {
                icon: BarChart3,
                title: "Insights & Analytics",
                desc: "Visualize spending, set goals, and see where your money goes.",
              },
            ].map((s) => (
              <div
                key={s.title}
                className="p-7 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="h-12 w-12 rounded-md bg-primary/10 text-primary flex items-center justify-center mb-5">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif font-bold text-xl mb-2 text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
            How It Works
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Get started in three steps.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Create your account",
              desc: "Sign up in under two minutes with just an email. No paperwork.",
            },
            {
              step: "02",
              title: "Fund your balance",
              desc: "Start with a welcome balance and add funds whenever you like.",
            },
            {
              step: "03",
              title: "Send & track money",
              desc: "Transfer instantly to anyone and follow every transaction in real time.",
            },
          ].map((s) => (
            <div key={s.step} className="relative">
              <div className="text-6xl font-serif font-bold text-accent/30 mb-3">
                {s.step}
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                {s.title}
              </h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECURITY */}
      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="container mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
              Security First
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-5">
              Your money. Locked down by design.
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Every transaction is verified, encrypted, and recorded. We
              partner with leading security providers and apply the same
              standards trusted by global financial institutions.
            </p>
            <ul className="space-y-3">
              {[
                "256-bit AES encryption at rest and in transit",
                "Atomic transfers with full audit trail",
                "Row-level data isolation per customer",
                "24/7 fraud monitoring and alerts",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-primary-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, label: "SOC 2 Type II" },
              { icon: Lock, label: "PCI DSS" },
              { icon: Users, label: "GDPR Ready" },
              { icon: HeadphonesIcon, label: "24/7 Support" },
            ].map((b) => (
              <div
                key={b.label}
                className="p-6 rounded-lg bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur-sm text-center"
              >
                <b.icon className="h-8 w-8 text-accent mx-auto mb-3" />
                <div className="font-semibold">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
            Customer Stories
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
            Trusted by people who value reliability.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "Meridian feels like a private bank with the speed of a modern app. I switched and never looked back.",
              name: "Eleanor Whitfield",
              role: "Architect",
            },
            {
              quote:
                "The transfer experience is unmatched. Funds arrive instantly and the audit trail gives me full peace of mind.",
              name: "Marcus Doyle",
              role: "Small Business Owner",
            },
            {
              quote:
                "Clean, calm, and serious. It's the first banking product I've actually enjoyed using daily.",
              name: "Priya Raman",
              role: "Product Designer",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="p-7 rounded-lg bg-card border border-border flex flex-col"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <Quote className="h-8 w-8 text-accent mb-4" />
              <p className="text-foreground/90 leading-relaxed mb-6 flex-1">
                "{t.quote}"
              </p>
              <div>
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-muted/40 border-y border-border">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
              Simple Pricing
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Choose a plan that fits your life.
            </h2>
            <p className="text-muted-foreground text-lg">
              No hidden fees. Cancel anytime. Upgrade as you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Essential",
                price: "$0",
                period: "/month",
                desc: "Everything to get started.",
                features: [
                  "1 personal account",
                  "Unlimited transfers",
                  "Real-time balance",
                  "Email support",
                ],
                cta: "Start Free",
                highlight: false,
              },
              {
                name: "Premium",
                price: "$9",
                period: "/month",
                desc: "For everyday banking power users.",
                features: [
                  "Up to 5 accounts",
                  "High-yield savings",
                  "Priority transfers",
                  "Priority support",
                ],
                cta: "Go Premium",
                highlight: true,
              },
              {
                name: "Business",
                price: "$29",
                period: "/month",
                desc: "Built for teams and companies.",
                features: [
                  "Unlimited accounts",
                  "Team permissions",
                  "Expense reporting",
                  "Dedicated manager",
                ],
                cta: "Contact Sales",
                highlight: false,
              },
            ].map((p) => (
              <div
                key={p.name}
                className={`p-7 rounded-lg border flex flex-col ${
                  p.highlight
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border"
                }`}
                style={
                  p.highlight
                    ? { boxShadow: "var(--shadow-elegant)" }
                    : { boxShadow: "var(--shadow-card)" }
                }
              >
                <div className="font-serif text-2xl font-bold mb-1">
                  {p.name}
                </div>
                <div
                  className={`text-sm mb-5 ${
                    p.highlight
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {p.desc}
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-serif font-bold">
                    {p.price}
                  </span>
                  <span
                    className={
                      p.highlight
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  >
                    {p.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check
                        className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
                          p.highlight ? "text-accent" : "text-primary"
                        }`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    className={`w-full font-semibold ${
                      p.highlight
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : ""
                    }`}
                    variant={p.highlight ? "default" : "outline"}
                  >
                    {p.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-accent mb-3">
              FAQ
            </p>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              Questions, answered.
            </h2>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our team is one click away.
            </p>
          </div>
          <div className="md:col-span-2 space-y-6">
            {[
              {
                q: "Is Meridian a real bank?",
                a: "Meridian is a simulated banking experience designed for demonstration purposes. No real funds are held or transferred.",
              },
              {
                q: "How fast are transfers?",
                a: "Transfers between Meridian accounts settle in seconds with a full atomic audit trail.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We use row-level security, end-to-end encryption, and strict access controls to protect every customer.",
              },
              {
                q: "Can I have multiple accounts?",
                a: "Absolutely. You can create checking, savings, and goal-based accounts from your dashboard.",
              },
            ].map((f) => (
              <div
                key={f.q}
                className="border-b border-border pb-6 last:border-b-0"
              >
                <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                  {f.q}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Ready to bank with confidence?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Join thousands who've made the switch to a calmer, more reliable
            way to manage money.
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
            >
              Open Your Free Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="font-serif text-xl font-bold text-primary mb-3">
                Meridian Bank
              </div>
              <p className="text-sm text-muted-foreground">
                Banking built on trust, designed for today.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Checking", "Savings", "Cards", "Business"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "Disclosures"],
              },
            ].map((c) => (
              <div key={c.title}>
                <div className="font-semibold text-foreground mb-3">
                  {c.title}
                </div>
                <ul className="space-y-2">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Meridian Bank. Simulated banking for
            demo purposes.
          </div>
        </div>
      </footer>
    </div>
  );
}
