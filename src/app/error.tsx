"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full neo-outset p-8 rounded-[32px] bg-white border border-white/60 text-center space-y-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 p-4 bg-slate-100 rounded-lg text-left text-[10px] text-rose-600 overflow-auto max-h-40">
              {error.message}
            </pre>
          )}
        </div>

        <button
          onClick={reset}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
        >
          <RefreshCcw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
