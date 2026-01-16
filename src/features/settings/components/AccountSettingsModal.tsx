"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail, AlertTriangle, X } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;
type EmailFormValues = z.infer<typeof emailSchema>;

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export function AccountSettingsModal({
  isOpen,
  onClose,
  userEmail,
}: AccountSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"password" | "email" | "delete">(
    "password"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  // Forms
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  // Handlers
  const handlePasswordUpdate = async (data: PasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (error) throw error;
      setSuccess("Password updated successfully.");
      passwordForm.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailUpdate = async (data: EmailFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.updateUser({
        email: data.email,
      });
      if (error) throw error;
      setSuccess("Confirmation email sent to new address.");
      emailForm.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update email");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(null);
    passwordForm.reset();
    emailForm.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        onClick={resetState}
      />

      <div className="relative w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={resetState}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Account Settings
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage your security and preferences.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
          {(["password", "email", "delete"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "delete"
                ? "Danger Zone"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
            {success}
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                New Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-slate-300"
                  size={18}
                />
                <input
                  {...passwordForm.register("password")}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
              {passwordForm.formState.errors.password && (
                <p className="text-[10px] text-rose-500 font-bold pl-1">
                  {passwordForm.formState.errors.password.message}
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
                  {...passwordForm.register("confirmPassword")}
                  type="password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700"
                  placeholder="••••••••"
                />
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-[10px] text-rose-500 font-bold pl-1">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        )}

        {/* Email Tab */}
        {activeTab === "email" && (
          <form
            onSubmit={emailForm.handleSubmit(handleEmailUpdate)}
            className="space-y-4"
          >
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl mb-4">
              <p className="text-xs text-indigo-700 font-medium">
                Current Email: <span className="font-bold">{userEmail}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                New Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-slate-300"
                  size={18}
                />
                <input
                  {...emailForm.register("email")}
                  type="email"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-bold text-slate-700"
                  placeholder="new@example.com"
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-[10px] text-rose-500 font-bold pl-1">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Update Email"
              )}
            </button>
          </form>
        )}

        {/* Delete Tab */}
        {activeTab === "delete" && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-800">
                Delete Account?
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                This action cannot be undone. All your financial data,
                assumptions, and history will be permanently erased.
              </p>
            </div>
            <button
              disabled={true} // Safety mechanism for now
              className="w-full py-4 bg-rose-50 text-rose-400 border border-rose-100 rounded-xl font-black text-xs uppercase tracking-widest cursor-not-allowed opacity-75"
              title="Contact support to delete account"
            >
              Delete Account (Contact Support)
            </button>
            <p className="text-[10px] text-slate-400 font-medium">
              account-deletion@spendsafe.app
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
