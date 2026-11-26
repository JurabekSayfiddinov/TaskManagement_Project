import { AppHeader } from "@/components/ui/layout/app-header";
import { AppSidebar } from "@/components/ui/layout/app-sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />

      <div className="ml-60 min-h-screen">
        <AppHeader />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}