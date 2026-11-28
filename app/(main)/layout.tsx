
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AppHeader } from "@/components/ui/layout/app-header";
import { AppSidebar } from "@/components/ui/layout/app-sidebar";

import { WorkspaceProvider } from "@/features/workspaces/context/workspace-context";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setAllowed(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!allowed) {
    return null;
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar />

        <div className="ml-60 min-h-screen">
          <AppHeader />

          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}
