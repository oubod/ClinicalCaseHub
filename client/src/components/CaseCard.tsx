import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Case, User } from "../shared/schema";

export interface CaseWithAuthor extends Case {
  author: User;
}

interface CaseCardProps {
  caseData: CaseWithAuthor;
  onClick?: () => void;
}

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

export function CaseCard({ caseData, onClick }: CaseCardProps) {
  const timeAgo = formatDistanceToNow(new Date(caseData.createdAt), { addSuffix: true });
  
  return (
    <div
      className="bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            {caseData.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {caseData.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <img
            src={caseData.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(caseData.author.firstName + ' ' + caseData.author.lastName)}&background=2563eb&color=fff`}
            alt={`${caseData.author.firstName} ${caseData.author.lastName}`}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">
            {caseData.author.firstName} {caseData.author.lastName}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          {caseData.author.specialty}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {caseData.comments.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Paperclip className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {caseData.attachments.length}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {caseData.tags.slice(0, 3).map((tag: string, index: number) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
