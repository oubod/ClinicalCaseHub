import { useState } from "react";
import { Search, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  onSearch: (query: string) => void;
  onCreateCase: () => void;
}

export default function Header({ onSearch, onCreateCase }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <header className="bg-white dark:bg-card border-b border-slate-200 dark:border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-foreground">Clinical Cases</h2>
          <p className="text-slate-600 dark:text-muted-foreground">Share and discuss complex medical cases with colleagues</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search cases, specialties, tags..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 border border-slate-300 dark:border-border rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
            />
          </div>
          
          {/* Create Case Button */}
          <Button
            onClick={onCreateCase}
            className="bg-medical-blue hover:bg-medical-blue-dark text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-slate-600 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-100 dark:hover:bg-muted"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
