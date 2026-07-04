import { Link } from "react-router-dom";
import {
  Sparkles,
  BarChart3,
  Wallet,
  ShieldCheck,
  ArrowRight,
  PieChart,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Track Every Transaction",
    description:
      "Log income and expenses in seconds, organize by category, and search or filter your history instantly.",
  },
  {
    icon: BarChart3,
    title: "Visual Dashboards",
    description:
      "Interactive charts show exactly where your money goes — spending breakdowns, monthly trends, and more.",
  },
  {
    icon: Sparkles,
    title: "AI Financial Advisor",
    description:
      "Get personalized insights and money-saving recommendations generated from your real spending data.",
  },
  {
    icon: MessageCircle,
    title: "Ask Anything",
    description:
      "Chat with your AI advisor about budgeting, savings goals, or specific spending questions — anytime.",
  },
  {
    icon: PieChart,
    title: "Export & Reports",
    description:
      "Download your transaction history as CSV or a polished PDF report whenever you need it.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by Design",
    description:
      "Your data is protected with encrypted passwords, JWT authentication, and rate-limited APIs.",
  },
];

// Purely illustrative bar heights for the hero mockup card — not real data.
const previewBars = [38, 52, 34, 68, 46, 82];

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span className="text-xl">💰</span> Finance Tracker Platform
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-900/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/3 w-[32rem] h-[32rem] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="pointer-events-none absolute top-20 -right-20 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:32px_32px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-indigo-300 text-xs font-medium px-3 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by AI
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.2rem] font-medium leading-[1.05] tracking-tight text-white">
              Understand your
              <br />
              money,{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">
                effortlessly.
              </span>
            </h1>

            <p className="mt-7 text-base md:text-lg text-slate-400 max-w-lg leading-relaxed">
              Track spending, visualize trends, and get personalized AI-powered
              advice to save more — all in one clean dashboard.
            </p>

            <div className="mt-9 flex items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/30"
              >
                Start for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border border-white/10 text-slate-200 font-medium px-6 py-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                Log In
              </Link>
            </div>

            {/* Trust row — reuses existing feature claims, no new copy invented */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-slate-500">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Secure by design
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                AI-powered insights
              </div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <Wallet className="w-4 h-4 text-indigo-400" />
                All spending in one place
              </div>
            </div>
          </div>

          {/* Right: signature dashboard mockup */}
          <div className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-900/60 shadow-2xl shadow-black/50 p-6">
              {/* window chrome */}
              <div className="flex items-center gap-1.5 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="ml-3 text-xs text-slate-500 font-mono">overview</span>
              </div>

              <p className="text-xs uppercase tracking-wider text-slate-500">Total Balance</p>
              <div className="mt-1.5 flex items-baseline gap-3">
                <span className="font-mono text-4xl font-semibold text-white">$24,582.30</span>
                <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  ▲ 12.4%
                </span>
              </div>

              {/* bar chart */}
              <div className="mt-8 flex items-end gap-3 h-32">
                {previewBars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-indigo-500/80 to-purple-400/80"
                      style={{ height: `${h}%` }}
                    />
                    <span className="text-[10px] font-mono text-slate-600">
                      {["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i]}
                    </span>
                  </div>
                ))}
              </div>

              {/* legend */}
              <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap gap-x-5 gap-y-2">
                {[
                  ["Food & Dining", "bg-indigo-400"],
                  ["Transport", "bg-purple-400"],
                  ["Savings", "bg-emerald-400"],
                ].map(([label, dot]) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

          
            {/* floating AI insight chip
            <div className="absolute -top-5 -right-5 z-20 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/10 bg-slate-900 shadow-xl shadow-black/40 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-xs font-medium text-white">AI Insight</p>
                <p className="text-[11px] text-slate-500">Dining is up 18% this month</p>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="text-center mb-14">
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-white">
            Everything you need to manage your money
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Simple tools, powerful insights.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group relative rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-white/10 p-6 hover:border-indigo-400/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-5 shadow-lg shadow-indigo-900/30 group-hover:scale-105 transition-transform">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-sm px-8 py-14 md:px-16 md:py-16">
          {/* ambient glow, matching hero treatment instead of a flat color fill */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-purple-600/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-indigo-600/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:28px_28px]" />

          <div className="relative z-10 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 text-indigo-300 text-xs font-medium px-3 py-1.5 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Free to start
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-white mb-4 leading-tight">
                Ready to take control
                <br className="hidden md:block" /> of your finances?
              </h2>
              <p className="text-slate-400 text-sm md:text-base mb-8">
                Create your free account in under a minute.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/40"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* reinforces existing product claims — no new copy invented */}
            <div className="space-y-4">
              {[
                [ShieldCheck, "Bank-level encryption on every account"],
                [Sparkles, "AI insights generated from your real spending"],
                [Wallet, "All your transactions in one dashboard"],
              ].map(([Icon, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-sm text-slate-200">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} FinTrack AI. Built with the MERN stack.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
