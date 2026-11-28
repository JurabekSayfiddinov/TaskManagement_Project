
"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getCurrentUser,
  getWorkspaces,
  getProjects,
  getProjectStates,
  getProjectTasks,
  getUnreadNotifications,
} from "../api/dashboard.api";

import { getDashboardStats } from "./dashboard-utils";

export function useDashboard(selectedSlug?: string) {
  return useQuery({
    queryKey: ["dashboard", selectedSlug],

    queryFn: async () => {
      const [user, workspaces] = await Promise.all([
        getCurrentUser(),
        getWorkspaces(),
      ]);

      const workspace = selectedSlug
        ? workspaces.find((item) => item.slug === selectedSlug)
        : workspaces[0];

      if (!workspace) {
        return {
          user,
          workspaces,
          workspace: null,
          projects: [],
          tasks: [],
          states: [],
          unreadCount: 0,
          stats: getDashboardStats([], []),
        };
      }

      const [allProjects, unreadCount] = await Promise.all([
        getProjects(workspace.slug),
        getUnreadNotifications(workspace.slug),
      ]);

      const activeProjects = allProjects.filter(
        (project) => !project.is_archived
      );

      const projects = await Promise.all(
        activeProjects.map(async (project) => {
          const [states, tasks, myTasks] =
            await Promise.all([
              getProjectStates(
                workspace.slug,
                project.id
              ),
              getProjectTasks(
                workspace.slug,
                project.id
              ),
              getProjectTasks(
                workspace.slug,
                project.id,
                user.id
              ),
            ]);

          return {
            ...project,
            states,
            tasks,
            myTasks,
          };
        })
      );

      const tasks = projects.flatMap(
        (project) => project.myTasks
      );

      const states = projects.flatMap(
        (project) => project.states
      );

      const stats = getDashboardStats(tasks, states);

      return {
        user,
        workspaces,
        workspace,
        projects,
        tasks,
        states,
        unreadCount,
        stats,
      };
    },

    staleTime: 30_000,
    retry: false,
  });
}
