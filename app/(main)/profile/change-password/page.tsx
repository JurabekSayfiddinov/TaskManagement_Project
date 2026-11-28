"use client";

import { useState, type FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import changePassword from "./change";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setErrorMessage("");
    setSaved(false);

    if (newPassword.length < 8) {
      setErrorMessage("The new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("The new passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaved(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error?.message;
        if (typeof message === "string") {
          setErrorMessage(message);
          return;
        }
      }

      setErrorMessage("Could not change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="max-w-lg space-y-5">
      <h1 className="text-3xl font-bold">Change password</h1>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border bg-card p-6">
        <fieldset disabled={saving} className="space-y-4">
          <label className="block space-y-2 text-sm font-medium">
            <span>Current password</span>
            <Input
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>New password</span>
            <Input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              minLength={8}
              required
            />
          </label>

          <label className="block space-y-2 text-sm font-medium">
            <span>Confirm new password</span>
            <Input
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
        </fieldset>

        {errorMessage && <p role="alert" className="text-sm text-destructive">{errorMessage}</p>}
        {saved && <p role="status" className="text-sm text-primary">Your password was changed.</p>}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Change password"}
          </Button>
          <Link href="/profile" className="text-sm hover:underline">Back to profile</Link>
        </div>
      </form>
    </section>
  );
}
