import Link from "next/link";
import { Check, ShieldCheck, Zap, Heart } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <ShieldCheck size={18} strokeWidth={3} />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              SpendSafe
            </span>
          </Link>
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
          Simple Pricing for{" "}
          <span className="text-indigo-600">Peace of Mind</span>.
        </h1>
        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
          Choose the plan that fits your freelance journey. No hidden fees.
          Cancel anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Starter
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Perfect for new freelancers.
                </p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  $0
                </span>
                <span className="text-sm font-bold text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Manual Income Capture</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Basic "Panic Mode"</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Up to 10 Pending Invoices</span>
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full py-4 bg-slate-100 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98] text-center"
              >
                Join for Free
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 shadow-2xl relative scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Most Popular
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Pro
                </h3>
                <p className="text-sm text-slate-400 font-medium mt-1">
                  For growing businesses.
                </p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-white tracking-tighter">
                  $12
                </span>
                <span className="text-sm font-bold text-slate-500">/mo</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-300">
                  <Check size={16} className="text-indigo-400" />
                  <span>Everything in Starter</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-300">
                  <Check size={16} className="text-indigo-400" />
                  <span>Unlimited Invoices</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-300">
                  <Check size={16} className="text-indigo-400" />
                  <span>Advanced Reality Checks</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-300">
                  <Check size={16} className="text-indigo-400" />
                  <span>Income History & Trends</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=pro"
                className="block w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all active:scale-[0.98] text-center shadow-lg shadow-indigo-900/50"
              >
                Start 14-Day Trial
              </Link>
            </div>
          </div>

          {/* Business Plan */}
          <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">
                  Business
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  For agency owners.
                </p>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  $29
                </span>
                <span className="text-sm font-bold text-slate-400">/mo</span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Multiple Team Members</span>
                </li>
                <li className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                  <Check size={16} className="text-indigo-500" />
                  <span>Priority Support</span>
                </li>
              </ul>
              <Link
                href="/signup?plan=business"
                className="block w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] text-center"
              >
                Contact Sales
              </Link>
            </div>
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
          <p className="text-[10px] text-slate-300 font-medium">
            &copy; {new Date().getFullYear()} SpendSafe.
          </p>
        </div>
      </footer>
    </div>
  );
}
