import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { insertCommentSchema } from "@shared/schema";
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
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Paperclip, User } from "lucide-react";
import type { CaseWithDetails } from "@shared/schema";
import { z } from "zod";

interface CaseDetailsModalProps {
  caseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const commentSchema = insertCommentSchema.extend({
  content: z.string().min(1, "Comment cannot be empty").max(2000, "Comment must be less than 2000 characters"),
});

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  resolved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

const tagColors = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
];

export default function CaseDetailsModal({ caseId, open, onOpenChange }: CaseDetailsModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: caseData, isLoading } = useQuery({
    queryKey: ["/api/cases", caseId],
    queryFn: async () => {
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<CaseWithDetails>;
    },
    enabled: open && !!caseId,
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: { content: string }) => {
      await apiRequest("POST", `/api/cases/${caseId}/comments`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cases", caseId] });
      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmitComment = (data: z.infer<typeof commentSchema>) => {
    createCommentMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-muted rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-muted rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-muted rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!caseData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-muted-foreground">Case not found.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-semibold pr-8">
              {caseData.title}
            </DialogTitle>
            <Badge 
              className={`text-xs font-medium ${statusColors[caseData.status as keyof typeof statusColors] || statusColors.active}`}
            >
              {caseData.status?.charAt(0).toUpperCase() + caseData.status?.slice(1) || 'Active'}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            <img 
              src={caseData.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(caseData.author.firstName + ' ' + caseData.author.lastName || 'User')}&background=2563eb&color=fff`}
              alt={`${caseData.author.firstName} ${caseData.author.lastName}`}
              className="w-12 h-12 rounded-full object-cover" 
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-foreground">
                Dr. {caseData.author.firstName} {caseData.author.lastName}
              </p>
              <p className="text-sm text-slate-500 dark:text-muted-foreground">
                {caseData.author.specialty || caseData.specialty} • {formatDistanceToNow(new Date(caseData.createdAt!), { addSuffix: true })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Case Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-foreground">Case Description</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {caseData.description}
              </p>
            </div>
          </div>

          {/* Tags */}
          {caseData.tags && caseData.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-foreground">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {caseData.tags.map((tag, index) => (
                  <Badge 
                    key={tag} 
                    variant="secondary"
                    className={`text-xs ${tagColors[index % tagColors.length]}`}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {caseData.attachments && caseData.attachments.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900 dark:text-foreground">Attachments</h3>
              <div className="space-y-2">
                {caseData.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-slate-50 dark:bg-muted rounded">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-slate-600 dark:text-muted-foreground" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                Discussion ({caseData.comments?.length || 0})
              </h3>
            </div>

            {/* Add Comment Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4 mb-6">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts, insights, or questions about this case..."
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={createCommentMutation.isPending}
                    className="bg-medical-blue hover:bg-medical-blue-dark text-white"
                  >
                    {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </form>
            </Form>

            {/* Comments List */}
            <div className="space-y-4">
              {caseData.comments && caseData.comments.length > 0 ? (
                caseData.comments.map((comment) => (
                  <div key={comment.id} className="bg-slate-50 dark:bg-muted rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <img 
                        src={comment.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.firstName + ' ' + comment.author.lastName || 'User')}&background=2563eb&color=fff`}
                        alt={`${comment.author.firstName} ${comment.author.lastName}`}
                        className="w-8 h-8 rounded-full object-cover" 
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm text-slate-900 dark:text-foreground">
                            Dr. {comment.author.firstName} {comment.author.lastName}
                          </p>
                          <span className="text-xs text-slate-500 dark:text-muted-foreground">
                            {comment.author.specialty}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt!), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
