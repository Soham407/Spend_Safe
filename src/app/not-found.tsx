"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-2">
          <p className="text-6xl font-black text-indigo-500 tracking-tighter">
            404
          </p>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            We couldn't find the financial clarity you were looking for.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2"
          >
            <Home size={16} />
            <span>Return Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
