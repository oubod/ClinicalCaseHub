import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FiltersBarProps {
  filters: {
    specialty: string;
    status: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const specialties = [
  "All Specialties",
  "Cardiology",
  "Neurology", 
  "Orthopedics",
  "Emergency Medicine",
  "Pediatrics",
  "Radiology",
  "Surgery",
  "Internal Medicine",
  "Oncology",
];

const statuses = [
  "All Status",
  "Active Discussion",
  "Resolved", 
  "Awaiting Review",
];

const commonTags = [
  "Complex",
  "Rare",
  "Teaching",
  "Urgent",
  "Follow-up",
];

export default function FiltersBar({ filters, onFiltersChange }: FiltersBarProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border">
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-slate-700 dark:text-foreground">Filter by:</label>
        <Select
          value={filters.specialty}
          onValueChange={(value) => onFiltersChange({ ...filters, specialty: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {specialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-slate-600 dark:text-muted-foreground">Tags:</span>
        {commonTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer hover:bg-slate-200 dark:hover:bg-muted transition-colors"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
