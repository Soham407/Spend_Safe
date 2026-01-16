import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
          <h1 className="text-4xl">Privacy Policy</h1>
          <p className="lead">
            Your privacy is not an assumption. It's a guarantee.
          </p>

          <hr />

          <h3>1. Information We Collect</h3>
          <p>
            We collect information you provide directly to us, such as your
            email address when you create an account, and the financial data
            (income events, assumptions) you input into the app.
          </p>

          <h3>2. How We Use Your Information</h3>
          <p>
            We use your information solely to provide, maintain, and improve the
            SpendSafe service. We do not use your financial data for advertising
            purposes.
          </p>

          <h3>3. Data Storage & Security</h3>
          <p>
            Your data is stored securely using Supabase (PostgreSQL), with Row
            Level Security (RLS) ensuring that only you can access your private
            financial records. We employ industry-standard encryption for data
            in transit and at rest.
          </p>

          <h3>4. Cookies</h3>
          <p>
            We use necessary cookies for authentication (keeping you logged in)
            and security. We may use analytics cookies to understand how our
            service is used, but these do not track your individual financial
            inputs.
          </p>

          <h3>5. Third-Party Services</h3>
          <p>
            We use trusted third-party service providers (like Supabase for
            database/auth) to help us provide our services. These providers have
            access to your personal information only to perform specific tasks
            on our behalf and are obligated not to disclose or use it for any
            other purpose.
          </p>

          <h3>6. Your Rights</h3>
          <p>
            You have the right to access, update, or delete your personal
            information at any time via your account settings. If you delete
            your account, your data is permanently removed from our systems.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@spendsafe.app.
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
