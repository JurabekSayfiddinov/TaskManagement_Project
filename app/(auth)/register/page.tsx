"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  SquareCheckBig,
  Ticket,
  User,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import registeruser from "./reg";

const registerSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  invite_token: z.string().trim().optional(),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      display_name: "",
      email: "",
      password: "",
      invite_token: "",
    },
  });

  const registration = useMutation({
    mutationFn: registeruser,
    onSuccess: () => {
      router.replace("/login");
    },
  });

  function onSubmit({ invite_token, ...account }: RegisterValues) {
    registration.mutate(
      invite_token ? { ...account, invite_token } : account,
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-[448px]">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <SquareCheckBig size={20} aria-hidden="true" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Join your company workspace
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-1.5">
              <label htmlFor="display_name" className="text-sm font-medium">
                Full Name
              </label>

              <div className="relative">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  {...register("display_name")}
                  id="display_name"
                  placeholder="Alex Morgan"
                  autoComplete="name"
                  className="h-[38px] pl-9"
                  maxLength={100}
                  required
                  aria-invalid={Boolean(errors.display_name)}
                  aria-describedby="display-name-feedback"
                />
              </div>

              <p
                id="display-name-feedback"
                className={
                  errors.display_name
                    ? "text-xs text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                {errors.display_name?.message ?? "1–100 characters"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Work Email
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex.morgan@company.com"
                  className="h-[38px] pl-9"
                  required
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>

              {errors.email && (
                <p id="email-error" className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  className="h-[38px] pl-9 pr-10"
                  required
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby="password-feedback"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>

              <p
                id="password-feedback"
                className={
                  errors.password
                    ? "text-xs text-destructive"
                    : "text-xs text-muted-foreground"
                }
              >
                {errors.password?.message ?? "Minimum 8 characters"}
              </p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="invite_token" className="text-sm font-medium">
                Invitation Token
                <span className="ml-1 text-muted-foreground">(Optional)</span>
              </label>

              <div className="relative">
                <Ticket
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  {...register("invite_token")}
                  id="invite_token"
                  placeholder="Paste workspace invite token"
                  className="h-[38px] pl-9"
                />
              </div>
            </div>

            {registration.isError && (
              <p role="alert" className="text-sm text-destructive">
                Unable to create your account. Please try again.
              </p>
            )}

            <Button
              type="submit"
              className="mt-2 h-9 w-full"
              disabled={registration.isPending}
            >
              {registration.isPending ? "Creating account…" : "Create Account"}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Secure workspace registration</span>
        </div>
      </div>
    </main>
  );
}