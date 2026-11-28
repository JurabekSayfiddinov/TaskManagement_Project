"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
   SquareCheckBig,
   LayoutDashboard,
   CircleCheck,
   FolderKanban,
   Users,
   Bell,
   UserRound,
   LogOut,
   Building2,
} from "lucide-react"

import { WorkspaceSwitcher } from "@/features/workspaces/components/workspace-switcher"
import { cn } from "@/lib/utils"
import { logoutSession } from "@/lib/api"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import getme from "@/app/(main)/profile/prof"

const navigation = [
   {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
   },
   {
      title: "My Tasks",
      href: "/my-tasks",
      icon: CircleCheck,
   },
   {
      title: "Workspaces",
      href: "/workspaces",
      icon: Building2,
   },
   {
      title: "Projects",
      href: "/projects",
      icon: FolderKanban,
   },
   {
      title: "Members",
      href: "/members",
      icon: Users,
   },
   {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
   },
]

export function AppSidebar() {
   const { data } = useQuery({
      queryFn: getme,
      queryKey: ["profile"],
   })

   const pathname = usePathname()
   const router = useRouter()
   const queryClient = useQueryClient()

   function handleLogout() {
      logoutSession()

      queryClient.clear()

      router.replace("/login")
   }

   return (
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-border bg-sidebar">
         <div className="p-4">
            <Link href="/dashboard" className="flex h-10 items-center gap-3 px-2">
               <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                  <SquareCheckBig size={18} />
               </div>

               <span className="text-sm font-semibold">Task Management</span>
            </Link>
         </div>

         {/* Workspace */}
         <div className="px-4 pt-2">
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
               Workspace
            </p>

            <WorkspaceSwitcher />
         </div>

         {/* Navigation */}
         <div className="mt-6 px-4">
            <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
               Menu
            </p>

            <nav className="space-y-1">
               {navigation.map((item) => {
                  const Icon = item.icon

                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

                  return (
                     <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                           "flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors",
                           isActive
                              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                     >
                        <Icon size={16} />

                        <span>{item.title}</span>
                     </Link>
                  )
               })}
            </nav>
         </div>

         {/* User */}
         <div className="mt-auto border-t border-border p-4">
            <div className="mb-3 flex items-center gap-3 rounded-md border border-border bg-background p-2">
               <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-primary">
                  {data?.display_name?.trim().charAt(0).toUpperCase() || "?"}
               </div>

               <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{data?.display_name ?? "User"}</p>

                  <p className="truncate text-xs text-muted-foreground">{data?.email}</p>
               </div>
            </div>

            <Link
               href="/profile"
               className="flex h-9 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted"
            >
               <UserRound size={16} />
               Profile
            </Link>

            <button
               onClick={handleLogout}
               type="button"
               className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground hover:bg-muted"
            >
               <LogOut size={16} />
               Logout
            </button>
         </div>
      </aside>
   )
}
