"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import {
   getProjects,
   getProject,
   createProject,
   updateProject,
   deleteProject,
} from "../api/project.api"

import type { CreateProjectDto, UpdateProjectDto } from "../types/project"

export function useProjects(workspaceSlug?: string) {
   return useQuery({
      queryKey: ["projects", workspaceSlug],
      queryFn: () => getProjects(workspaceSlug!),
      enabled: !!workspaceSlug,
   })
}

export function useProject(workspaceSlug?: string, projectId?: string) {
   return useQuery({
      queryKey: ["project", workspaceSlug, projectId],
      queryFn: () => getProject(workspaceSlug!, projectId!),
      enabled: !!workspaceSlug && !!projectId,
   })
}

export function useCreateProject(workspaceSlug?: string) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (data: CreateProjectDto) => {
         if (!workspaceSlug) {
            throw new Error("Select a workspace first.")
         }

         return createProject(workspaceSlug, data)
      },

      onSuccess: async () => {
         await Promise.all([
            queryClient.invalidateQueries({
               queryKey: ["projects", workspaceSlug],
            }),

            queryClient.invalidateQueries({
               queryKey: ["dashboard"],
            }),
         ])
      },
   })
}

export function useUpdateProject(workspaceSlug?: string) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ projectId, data }: { projectId: string; data: UpdateProjectDto }) => {
         if (!workspaceSlug) {
            throw new Error("Select a workspace first.")
         }

         return updateProject(workspaceSlug, projectId, data)
      },

      onSuccess: async (_, variables) => {
         await Promise.all([
            queryClient.invalidateQueries({
               queryKey: ["projects", workspaceSlug],
            }),

            queryClient.invalidateQueries({
               queryKey: ["project", workspaceSlug, variables.projectId],
            }),

            queryClient.invalidateQueries({
               queryKey: ["dashboard"],
            }),
         ])
      },
   })
}

export function useDeleteProject(workspaceSlug?: string) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (projectId: string) => {
         if (!workspaceSlug) {
            throw new Error("Select a workspace first.")
         }

         return deleteProject(workspaceSlug, projectId)
      },

      onSuccess: async (_, projectId) => {
         queryClient.removeQueries({
            queryKey: ["project", workspaceSlug, projectId],
         })

         await Promise.all([
            queryClient.invalidateQueries({
               queryKey: ["projects", workspaceSlug],
            }),

            queryClient.invalidateQueries({
               queryKey: ["dashboard"],
            }),
         ])
      },
   })
}
