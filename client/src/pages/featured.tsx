import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CaseCard } from "@/components/CaseCard";
import { CaseDetailsModal } from "@/components/CaseDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, Clock } from "lucide-react";
import type { CaseWithAuthor } from "../shared/schema";

export default function Featured() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCaseModal, setShowCaseModal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: allCases = [], isLoading: casesLoading } = useQuery({
    queryKey: ["/api/cases"],
    queryFn: async () => {
      const response = await fetch('/api/cases');
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<CaseWithAuthor[]>;
    },
    enabled: isAuthenticated,
  });

  // Filter and categorize cases
  const featuredCases = allCases.filter(caseData => caseData.featured);
  const complexCases = allCases.filter(caseData => 
    caseData.tags?.includes("Complex") || caseData.tags?.includes("Rare")
  );
  const recentCases = allCases.slice(0, 6); // Most recent cases
  const popularCases = allCases.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 6);

  // Search functionality
  const filteredCases = allCases.filter(caseData =>
    searchQuery && (
      caseData.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseData.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseData.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const onCaseClick = (id: string) => {
    setSelectedCase(id);
    setShowCaseModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <Star className="text-white text-2xl" />
          </div>
          <p className="text-slate-600 dark:text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={setSearchQuery}
          onCreateCase={() => {}}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-2">Featured Cases</h1>
            <p className="text-slate-600 dark:text-muted-foreground">
              Discover exceptional clinical cases curated for learning and discussion
            </p>
          </div>

          {/* Search Results */}
          {searchQuery && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-4">
                Search Results for "{searchQuery}"
              </h2>
              <CasesGrid 
                cases={filteredCases}
                loading={casesLoading}
                onCaseClick={onCaseClick}
                emptyMessage={`No cases found matching "${searchQuery}"`}
              />
            </div>
          )}

          {!searchQuery && (
            <>
              {/* Featured Cases Section */}
              {featuredCases.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Star className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                      Editor's Choice
                    </h2>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      Featured
                    </Badge>
                  </div>
                  <CasesGrid 
                    cases={featuredCases}
                    loading={casesLoading}
                    onCaseClick={onCaseClick}
                    emptyMessage="No featured cases available"
                  />
                </div>
              )}

              {/* Complex & Rare Cases */}
              {complexCases.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-500" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                      Complex & Rare Cases
                    </h2>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Advanced
                    </Badge>
                  </div>
                  <CasesGrid 
                    cases={complexCases.slice(0, 6)}
                    loading={casesLoading}
                    onCaseClick={onCaseClick}
                    emptyMessage="No complex cases available"
                  />
                </div>
              )}

              {/* Popular Cases */}
              {popularCases.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-6 h-6 text-green-500" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                      Most Discussed
                    </h2>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Popular
                    </Badge>
                  </div>
                  <CasesGrid 
                    cases={popularCases}
                    loading={casesLoading}
                    onCaseClick={onCaseClick}
                    emptyMessage="No popular cases available"
                  />
                </div>
              )}

              {/* Recent Cases */}
              {recentCases.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-foreground">
                      Recently Added
                    </h2>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      New
                    </Badge>
                  </div>
                  <CasesGrid 
                    cases={recentCases}
                    loading={casesLoading}
                    onCaseClick={onCaseClick}
                    emptyMessage="No recent cases available"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {selectedCase && (
        <CaseDetailsModal
          open={showCaseModal}
          onOpenChange={setShowCaseModal}
          caseId={selectedCase}
        />
      )}
    </div>
  );
}

interface CasesGridProps {
  cases: CaseWithAuthor[];
  loading: boolean;
  onCaseClick: (id: string) => void;
  emptyMessage: string;
}

function CasesGrid({ cases, loading, onCaseClick, emptyMessage }: CasesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-muted rounded-full"></div>
              <div>
                <div className="h-4 bg-slate-200 dark:bg-muted rounded w-24 mb-1"></div>
                <div className="h-3 bg-slate-200 dark:bg-muted rounded w-16"></div>
              </div>
            </div>
            <div className="h-5 bg-slate-200 dark:bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-muted rounded w-full mb-1"></div>
            <div className="h-4 bg-slate-200 dark:bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-slate-200 dark:bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <Star className="text-slate-400 dark:text-muted-foreground text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No cases found</h3>
        <p className="text-slate-600 dark:text-muted-foreground mb-4">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {cases.map((caseData) => (
        <CaseCard
          key={caseData.id}
          caseData={caseData}
          onClick={() => onCaseClick(caseData.id)}
        />
      ))}
    </div>
  );
}