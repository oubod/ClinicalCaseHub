import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CaseWithAuthor } from "@shared/schema";

interface CaseCardProps {
  case: CaseWithAuthor;
  onClick: () => void;
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

export default function CaseCard({ case: caseData, onClick }: CaseCardProps) {
  const timeAgo = formatDistanceToNow(new Date(caseData.createdAt!), { addSuffix: true });
  
  return (
    <div 
      className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={caseData.author.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(caseData.author.firstName + ' ' + caseData.author.lastName || 'User')}&background=2563eb&color=fff`}
              alt={`${caseData.author.firstName} ${caseData.author.lastName}`}
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div>
              <p className="font-medium text-slate-900 dark:text-foreground">
                Dr. {caseData.author.firstName} {caseData.author.lastName}
              </p>
              <p className="text-sm text-slate-500 dark:text-muted-foreground">
                {caseData.author.specialty || caseData.specialty}
              </p>
            </div>
          </div>
          <Badge 
            className={`text-xs font-medium ${statusColors[caseData.status as keyof typeof statusColors] || statusColors.active}`}
          >
            {caseData.status?.charAt(0).toUpperCase() + caseData.status?.slice(1) || 'Active'}
          </Badge>
        </div>
        
        <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground mb-2 line-clamp-2">
          {caseData.title}
        </h3>
        <p className="text-slate-600 dark:text-muted-foreground text-sm mb-4 line-clamp-3">
          {caseData.description}
        </p>
        
        {caseData.tags && caseData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {caseData.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className={`text-xs ${tagColors[index % tagColors.length]}`}
              >
                {tag}
              </Badge>
            ))}
            {caseData.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs text-slate-600 dark:text-muted-foreground">
                +{caseData.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>0 replies</span>
            </span>
            {caseData.attachments && caseData.attachments.length > 0 && (
              <span className="flex items-center space-x-1">
                <Paperclip className="w-4 h-4" />
                <span>{caseData.attachments.length} files</span>
              </span>
            )}
          </div>
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}
