"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import getme from "../prof";
import editme from "./editpr";

export default function EditProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [nameError, setNameError] = useState("");
  const [draftName, setDraftName] = useState<string | null>(null);
  const profile = useQuery({ queryKey: ["profile"], queryFn: getme });
  const displayName = draftName ?? profile.data?.display_name ?? "";

  const saveProfile = useMutation({
    mutationFn: editme,
    async onSuccess(updatedProfile) {
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      queryClient.setQueryData(["profile"], updatedProfile);
      router.replace("/profile");
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saveProfile.isPending) return;

    const name = displayName.trim();

    if (name.length < 1 || name.length > 100) {
      saveProfile.reset();
      setNameError("Enter a display name between 1 and 100 characters.");
      return;
    }

    setNameError("");
    const user = { display_name: name };
    saveProfile.mutate(user);
  }

  const sessionExpired =
    axios.isAxiosError(saveProfile.error) && saveProfile.error.response?.status === 401;

  return (
    <section className="max-w-lg space-y-6" aria-labelledby="edit-profile-title">
      <h1 id="edit-profile-title" className="text-3xl font-bold">
        Edit profile
      </h1>

      {profile.isPending && <p role="status">Loading your profile…</p>}

      {!profile.data && profile.isError && (
        <div className="space-y-3">
          <p role="alert">Could not load your profile.</p>
            <Button type="button" variant="outline" onClick={() => profile.refetch()}>
            Retry
          </Button>
        </div>
      )}

      {profile.data && (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border bg-card p-6"
        >
          <div className="space-y-2">
            <label htmlFor="display-name" className="text-sm font-medium">
              Display name
            </label>
            <Input
              id="display-name"
              name="display_name"
              autoComplete="nickname"
              value={displayName}
              onChange={(event) => setDraftName(event.target.value)}
              required
              maxLength={100}
              disabled={saveProfile.isPending}
                aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? "display-name-error" : undefined}
            />
            {nameError && (
              <p id="display-name-error" role="alert" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
          </div>

          {saveProfile.isError && (
            <p role="alert" className="text-sm text-destructive">
              {sessionExpired
                ? "Your session expired. Please sign in again."
                : "Could not save your profile. Please try again."}
            </p>
          )}

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={saveProfile.isPending}>
              {saveProfile.isPending ? "Saving…" : "Save changes"}
            </Button>
            <Link href="/profile" className="text-sm hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      )}
    </section>
  );
}
