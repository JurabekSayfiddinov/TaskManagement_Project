"use client";

import { useRef, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMembers } from "@/features/members/hooks/use-members";
import { createComment, deleteComment, getComments, updateComment, type TaskComment } from "./comment-api";
import { taskError } from "./task-api";

interface Props {
  workspace: string;
  projectId: string;
  taskId: string;
  currentUserId?: string;
}

export function TaskComments({ workspace, projectId, taskId, currentUserId }: Props) {
  const queryClient = useQueryClient();
  const queryKey = ["task-comments", workspace, projectId, taskId];
  const editor = useRef<HTMLTextAreaElement>(null);
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const comments = useQuery({
    queryKey,
    queryFn: () => getComments(workspace, projectId, taskId),
  });
  const members = useMembers(workspace);
  const role = members.data?.find((member) => member.user_id === currentUserId)?.role;
  const isAdmin = role === "admin" || role === "owner";
  const canWrite = isAdmin || role === "member";
  const visibleComments = comments.data?.filter((comment) => !comment.deleted_at) ?? [];

  function clearForm() {
    setBody("");
    setEditingId("");
  }

  const save = useMutation({
    mutationFn: (text: string) => {
      if (editingId) return updateComment(workspace, projectId, taskId, editingId, text);
      return createComment(workspace, projectId, taskId, text);
    },
    onSuccess() {
      clearForm();
      return queryClient.invalidateQueries({ queryKey });
    },
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteComment(workspace, projectId, taskId, id),
    onSuccess(_, id) {
      setDeleteId("");
      if (editingId === id) clearForm();
      return queryClient.invalidateQueries({ queryKey });
    },
  });
  const busy = save.isPending || remove.isPending;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = body.trim();
    if (!busy && canWrite && text) save.mutate(text);
  }

  function startEdit(comment: TaskComment) {
    save.reset();
    setEditingId(comment.id);
    setBody(comment.body);
    editor.current?.focus();
  }

  return (
    <section aria-label="Comments" className="space-y-4 border-t pt-5">
      <h3 className="font-semibold">Comments</h3>

      {canWrite && (
        <form onSubmit={handleSubmit} className="space-y-2">
          <label htmlFor="task-comment" className="text-sm font-medium">
            {editingId ? "Edit comment" : "Write a comment"}
          </label>
          <Textarea
            ref={editor}
            id="task-comment"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            required
            maxLength={50_000}
            disabled={busy}
          />
          {save.isError && (
            <p className="text-sm text-destructive" role="alert">
              {taskError(save.error, "Could not save the comment.")}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={busy || !body.trim()}>
              {save.isPending ? "Saving…" : editingId ? "Save changes" : "Post comment"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" disabled={busy} onClick={() => { save.reset(); clearForm(); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      )}
      {role === "guest" && <p className="text-sm text-muted-foreground">Guests can read comments.</p>}
      {members.isError && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p role="alert">Could not check comment permissions.</p>
          <Button type="button" variant="outline" onClick={() => members.refetch()}>Retry</Button>
        </div>
      )}

      {comments.isPending && <p role="status" className="text-sm">Loading comments…</p>}
      {comments.isError && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p role="alert">{taskError(comments.error, "Could not load comments.")}</p>
          <Button type="button" variant="outline" onClick={() => comments.refetch()}>Retry</Button>
        </div>
      )}
      {comments.isSuccess && visibleComments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet.</p>
      )}
      {visibleComments.length > 0 && (
        <ul className="divide-y">
          {visibleComments.map((comment) => (
            <li key={comment.id} className="space-y-2 py-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{comment.author?.display_name ?? "Unknown user"}</p>
                  <time dateTime={comment.created_at} className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </time>
                </div>
                {canWrite && (isAdmin || comment.author_id === currentUserId) && (
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" disabled={busy} onClick={() => startEdit(comment)}>
                      Edit
                    </Button>
                    <AlertDialog
                      open={deleteId === comment.id}
                      onOpenChange={(open) => {
                        if (busy) return;
                        if (open) remove.reset();
                        setDeleteId(open ? comment.id : "");
                      }}
                    >
                      <AlertDialogTrigger disabled={busy} render={<Button type="button" variant="destructive" />}>
                        Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete comment?</AlertDialogTitle>
                          <AlertDialogDescription>This comment will be removed from the task.</AlertDialogDescription>
                        </AlertDialogHeader>
                        {remove.isError && (
                          <p role="alert" className="text-sm text-destructive">
                            {taskError(remove.error, "Could not delete the comment.")}
                          </p>
                        )}
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
                          <AlertDialogAction type="button" variant="destructive" disabled={busy} onClick={() => remove.mutate(comment.id)}>
                            {remove.isPending ? "Deleting…" : "Delete comment"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <p className="whitespace-pre-wrap break-words text-sm">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
