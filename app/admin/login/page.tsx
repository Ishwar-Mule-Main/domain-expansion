"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Loader2, Lock, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface LoginFormData {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Prevent NextAuth from immediately redirecting
      });

      if (response?.error) {
        setErrorMsg("Access denied. Please check your credentials.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      console.error("Admin sign-in exception:", err);
      setErrorMsg("An unexpected server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0D0D0D] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Immersive background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#FF6200/5_0%,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md bg-[#141414]/80 border border-[#2E2E2E] rounded-2xl p-8 relative z-10 text-left shadow-2xl">
        <div className="flex flex-col items-center gap-4 text-center mb-8">
          <div className="h-12 w-12 rounded-xl border border-[#2E2E2E] bg-[#141414] flex items-center justify-center overflow-hidden">
            <img
              src="/Domain Expansion New Logo.png"
              alt="Domain Expansion Logo"
              className="h-9 w-9 object-contain"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Security Sign-In</h1>
            <p className="text-xs text-[#888898] mt-1">Domain Expansion Admin Portal</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-red-950/20 border border-red-900/30 text-red-400 text-xs flex gap-3 items-center">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Input
            label="Security Email"
            type="email"
            placeholder="enter admin email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email format"
              }
            })}
          />

          <Input
            label="Portal Password"
            type="password"
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register("password", { required: "Password is required" })}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="py-3 text-xs font-mono uppercase tracking-wider font-bold w-full mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Unlocking Portal...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-[10px] text-[#5A5A6A] leading-relaxed border-t border-[#2E2E2E]/60 pt-6">
          🔒 **Strict Redirection SLA**: This portal monitors authentication requests. Uninvited access or session spoofing triggers a security block on your IP.
        </div>
      </div>
    </main>
  );
}
