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
import { COPY } from "@/copy/en"; // Assuming we'll add auth copy later, or just hardcode for now for speed

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      router.push("/dashboard");
      router.refresh(); // Refresh server components
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    const email = getValues("email");
    if (!email || errors.email) {
      setError("Please enter a valid email address to send a magic link");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      setMagicLinkSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send magic link"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neo-outset p-6 md:p-8 rounded-[32px] bg-white border border-white/60 shadow-xl backdrop-blur-sm">
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Sign in to access your financial clarity.
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

      {magicLinkSent ? (
        <div className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-800">
            Check your email
          </h3>
          <p className="text-sm text-slate-600">
            We sent a magic link to{" "}
            <span className="font-bold">{getValues("email")}</span>.
            <br />
            Click the link to verify it's you.
          </p>
          <button
            onClick={() => setMagicLinkSent(false)}
            className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-600 mt-4 inline-block"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                const supabase = createClient();
                supabase.auth.signInWithOAuth({
                  provider: "google",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
              }}
              className="flex items-center justify-center space-x-2 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              {/* <img src="/google.svg" className="w-4 h-4" alt="Google" /> */}
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const supabase = createClient();
                supabase.auth.signInWithOAuth({
                  provider: "github",
                  options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                  },
                });
              }}
              className="flex items-center justify-center space-x-2 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              {/* <Github size={16} /> */}
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                Or continue with email
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
              <div className="flex justify-end">
                {/* Reset password link will go here in Phase 2 */}
              </div>
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
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                  Or continue with
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleMagicLink}
              disabled={isLoading}
              className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-[0.98] border border-indigo-100"
            >
              Email Magic Link
            </button>
          </form>
        </>
      )}

      <div className="mt-8 text-center">
        <p className="text-xs font-bold text-slate-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-600 hover:text-indigo-700 font-black uppercase tracking-wide"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
