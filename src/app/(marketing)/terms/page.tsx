import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function TermsPage() {
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
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto prose prose-slate prose-headings:font-black prose-headings:tracking-tight prose-p:font-medium prose-p:text-slate-600">
          <h1 className="text-4xl">Terms of Service</h1>
          <p className="lead">
            Using SpendSafe means you understand these terms. We value clarity
            in our policies just as much as in your finances.
          </p>

          <hr />

          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using SpendSafe ("the Service"), you agree to be
            bound by these Terms of Service. If you do not agree to these terms,
            please do not use the Service.
          </p>

          <h3>2. "No False Confidence" Disclaimer</h3>
          <p>
            SpendSafe is a financial visualization tool, not a financial
            advisor. We provide estimates based on the data you input and the
            assumptions you make.{" "}
            <strong>
              We do not guarantee financial safety or the accuracy of
              safe-to-spend calculations.
            </strong>{" "}
            You are solely responsible for your financial decisions.
          </p>

          <h3>3. Account Security</h3>
          <p>
            You are responsible for maintaining the security of your account
            credentials. SpendSafe is not liable for any loss or damage arising
            from your failure to protect your login information.
          </p>

          <h3>4. Data Handling</h3>
          <p>
            Your financial data is yours. We store it securely to provide the
            Service. We do not sell your personal financial data to third
            parties. Please refer to our Privacy Policy for details on data
            handling.
          </p>

          <h3>5. Subscription & Billing</h3>
          <p>
            Some features of SpendSafe may require a paid subscription. All fees
            are non-refundable unless otherwise stated. We reserve the right to
            change our pricing with notice.
          </p>

          <h3>6. Termination</h3>
          <p>
            We may terminate or suspend your access to the Service immediately,
            without prior notice or liability, for any reason whatsoever,
            including without limitation if you breach the Terms.
          </p>

          <h3>7. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. We will
            provide notice of significant changes. Your continued use of the
            Service following changes constitutes acceptance of those changes.
          </p>

          <div className="mt-12 p-6 bg-slate-100 rounded-2xl">
            <p className="text-sm font-bold text-slate-500 m-0">
              Last Updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </article>
      </main>

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
