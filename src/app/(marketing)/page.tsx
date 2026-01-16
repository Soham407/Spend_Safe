import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  PieChart,
  Lock,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              SpendSafe
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-5 py-2.5 text-xs font-black text-slate-600 uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
              <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-widest">
                For Freelancers & Solopreneurs
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              Financial Clarity Without the{" "}
              <span className="text-indigo-600">Guesswork</span>.
            </h1>

            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              Stop wondering if you can afford it. SpendSafe separates your
              confirmed cash from your hopeful assumptions, giving you the
              confidence to spend—or the wisdom to save.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 shadow-xl shadow-indigo-200"
              >
                <span>Start for Free</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center"
              >
                Live Demo
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[40px] blur-3xl -z-10"></div>
            <div className="neo-outset bg-white border border-white/60 p-6 rounded-[32px] shadow-2xl">
              {/* Mock UI Elements */}
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                      Safe to Spend
                    </div>
                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">
                      $4,250.00
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                    <PieChart size={24} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-700">
                        Pending Project A
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-400">
                      $3,000.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-700">
                        Retainer (Paid)
                      </span>
                    </div>
                    <span className="text-sm font-black text-slate-800">
                      $2,500.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[32px] bg-slate-50 space-y-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Assumption First
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Treat unconfirmed income as what it is: a guess. We actively
                separate pending invoices from money in the bank.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-slate-50 space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Panic Proof
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Hit the panic button to strip away all assumptions. See exactly
                how long you can survive on guaranteed funds alone.
              </p>
            </div>
            <div className="p-8 rounded-[32px] bg-slate-50 space-y-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                No False Confidence
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                We degrade old assumptions over time. If a client hasn't paid in
                45 days, we stop counting it as "coming soon."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
            Ready to face your finances?
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Join thousands of freelancers who sleep better knowing their true
            safe-to-spend number.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-xl"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="text-slate-300" size={20} />
            <span className="text-sm font-black text-slate-400 tracking-tight">
              SpendSafe
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link
              href="/terms"
              className="text-xs font-bold text-slate-400 hover:text-indigo-600"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-xs font-bold text-slate-400 hover:text-indigo-600"
            >
              Privacy
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-bold text-slate-400 hover:text-indigo-600"
            >
              Pricing
            </Link>
          </div>
          <p className="text-[10px] text-slate-300 font-medium">
            &copy; {new Date().getFullYear()} SpendSafe.
          </p>
        </div>
      </footer>
    </div>
  );
}
