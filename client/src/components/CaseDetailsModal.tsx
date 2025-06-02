import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import type { Case, CaseWithAuthor, Comment, User, Attachment } from "../shared/schema";
import { insertCommentSchema } from "../shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";

interface CaseDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId: string;
}

export function CaseDetailsModal({ open, onOpenChange, caseId }: CaseDetailsModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof insertCommentSchema>>({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const { data: caseData, isLoading } = useQuery<CaseWithAuthor>({
    queryKey: ["cases", caseId],
    queryFn: async () => {
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch case");
      }
      return response.json();
    },
    enabled: open && !!caseId,
  });

  const addCommentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertCommentSchema>) => {
      const response = await fetch(`/api/cases/${caseId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases", caseId] });
      form.reset();
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Error",
          description: "You must be logged in to add a comment.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add comment. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  if (!open) return null;

  if (isLoading || !caseData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const onSubmit = form.handleSubmit((data) => {
    addCommentMutation.mutate(data);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{caseData.title}</DialogTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Posted by {caseData.author.firstName} {caseData.author.lastName}</span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(caseData.createdAt))} ago</span>
          </div>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{caseData.specialty}</Badge>
              <Badge
                variant={
                  caseData.status === "active"
                    ? "default"
                    : caseData.status === "resolved"
                    ? "secondary"
                    : "destructive"
                }
              >
                {caseData.status}
              </Badge>
              <Badge
                variant={
                  caseData.priority === "low"
                    ? "outline"
                    : caseData.priority === "normal"
                    ? "secondary"
                    : caseData.priority === "high"
                    ? "default"
                    : "destructive"
                }
              >
                {caseData.priority} priority
              </Badge>
            </div>

            <div className="flex flex-wrap gap-1">
              {caseData.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <h3 className="font-semibold">Patient Information</h3>
              <div className="grid gap-1 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {caseData.patientAge}
                </div>
                <div>
                  <span className="font-medium">Gender:</span>{" "}
                  {caseData.patientGender}
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <h3 className="font-semibold">Description</h3>
              <p className="text-sm">{caseData.description}</p>
            </div>

            {caseData.diagnosis && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Diagnosis</h3>
                <p className="text-sm">{caseData.diagnosis}</p>
              </div>
            )}

            {caseData.treatment && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Treatment</h3>
                <p className="text-sm">{caseData.treatment}</p>
              </div>
            )}

            {caseData.outcome && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Outcome</h3>
                <p className="text-sm">{caseData.outcome}</p>
              </div>
            )}

            {caseData.attachments.length > 0 && (
              <div className="grid gap-2">
                <h3 className="font-semibold">Attachments</h3>
                <div className="grid gap-2">
                  {caseData.attachments.map((attachment: Attachment, index: number) => (
                    <a
                      key={index}
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span>{attachment.name}</span>
                      <span className="text-muted-foreground">
                        ({Math.round(attachment.size / 1024)} KB)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Comments</h3>
              <span className="text-sm text-muted-foreground">
                {caseData.comments.length} comments
              </span>
            </div>

            {user && (
              <Form {...form}>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Add a comment..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={addCommentMutation.isPending}
                    className="w-fit"
                  >
                    {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                  </Button>
                </form>
              </Form>
            )}

            <div className="grid gap-4">
              {caseData.comments.map((comment: Comment) => (
                <div key={comment.id} className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={comment.author?.profileImageUrl || undefined}
                        alt={comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : ""}
                      />
                      <AvatarFallback>
                        {comment.author?.firstName?.[0]}
                        {comment.author?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {comment.author?.firstName} {comment.author?.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      • {formatDistanceToNow(new Date(comment.createdAt))} ago
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
