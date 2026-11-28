
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import { useWorkspaces } from "../hooks/use-workspaces";
import type { Workspace } from "../types/workspace";

interface WorkspaceContextType {
  workspaces: Workspace[];
  workspace: Workspace | null;
  workspaceSlug: string | undefined;
  setWorkspaceSlug: (slug: string) => void;
  isPending: boolean;
  isError: boolean;
}

const WorkspaceContext =
  createContext<WorkspaceContextType | undefined>(
    undefined
  );

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: workspaces = [],
    isPending,
    isError,
  } = useWorkspaces();

  const [selectedSlug, setSelectedSlug] =
    useState<string | null>(() => {
      if (typeof window === "undefined") return null;

      return localStorage.getItem("workspaceSlug");
    });

  const workspace =
    workspaces.find((item) => item.slug === selectedSlug) ??
    workspaces[0] ??
    null;

  const workspaceSlug = workspace?.slug;

  useEffect(() => {
    if (isPending || isError) return;

    if (workspaceSlug) {
      localStorage.setItem(
        "workspaceSlug",
        workspaceSlug
      );
    } else {
      localStorage.removeItem("workspaceSlug");
    }
  }, [workspaceSlug, isPending, isError]);

  function setWorkspaceSlug(slug: string) {
    setSelectedSlug(slug);
  }

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        workspace,
        workspaceSlug,
        setWorkspaceSlug,
        isPending,
        isError,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspace must be used inside WorkspaceProvider"
    );
  }

  return context;
}
