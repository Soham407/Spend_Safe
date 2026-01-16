"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
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
          Verify your email
        </h2>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          We've sent a verification link to your email address. Please check
          your inbox to complete your registration.
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
          Create Account
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Start your improved financial journey today.
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

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          type="button"
          onClick={async () => {
            try {
              const supabase = createClient();
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              if (error) {
                console.error("Google OAuth error:", error);
                setError("Failed to sign in with Google. Please try again.");
              }
            } catch (err) {
              console.error("Google OAuth error:", err);
              setError("Failed to sign in with Google. Please try again.");
            }
          }}
          className="flex items-center justify-center space-x-2 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <span>Google</span>
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              const supabase = createClient();
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
              if (error) {
                console.error("GitHub OAuth error:", error);
                setError("Failed to sign in with GitHub. Please try again.");
              }
            } catch (err) {
              console.error("GitHub OAuth error:", err);
              setError("Failed to sign in with GitHub. Please try again.");
            }
          }}
          className="flex items-center justify-center space-x-2 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <span>GitHub</span>
        </button>
      </div>

      <div className="relative py-2 mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest text-[9px]">
            Or register with email
          </span>
        </div>
      </div>

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

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 text-slate-300"
              size={18}
            />
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] font-bold text-rose-500 pl-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-3.5 text-slate-300"
              size={18}
            />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] font-bold text-rose-500 pl-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-xs font-bold text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-wide"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
