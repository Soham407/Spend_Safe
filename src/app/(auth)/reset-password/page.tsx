"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Loader2,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const resetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send reset link"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="neo-outset p-8 md:p-10 rounded-[32px] bg-white border border-white/60 shadow-xl backdrop-blur-sm text-center">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          Check your email
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          We've sent a password reset link to your email address.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-8 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="neo-outset p-6 md:p-8 rounded-[32px] bg-white border border-white/60 shadow-xl backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Enter your email to receive reset instructions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start space-x-3">
          <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs font-bold text-rose-700 leading-relaxed">
            {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className="absolute left-4 top-3.5 text-slate-300"
              size={18}
            />
            <input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] font-bold text-rose-500 pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <span>Send Reset Link</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <Link
          href="/login"
          className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 inline-block"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
