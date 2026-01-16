import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | SpendSafe",
  description: "Login or Sign Up to SpendSafe",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            SpendSafe
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Assumption-First Finance
          </p>
        </div>

        {children}

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 font-medium select-none">
            &copy; {new Date().getFullYear()} SpendSafe. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
