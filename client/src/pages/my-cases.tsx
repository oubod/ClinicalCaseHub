import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import CaseCard from "@/components/CaseCard";
import CreateCaseModal from "@/components/CreateCaseModal";
import CaseDetailsModal from "@/components/CaseDetailsModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, TrendingUp, CheckCircle } from "lucide-react";
import type { CaseWithAuthor } from "@shared/schema";

export default function MyCases() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter cases by current user
  const myCases = allCases.filter(caseData => caseData.authorId === user?.id);
  const myActiveCases = myCases.filter(caseData => caseData.status === "active");
  const myResolvedCases = myCases.filter(caseData => caseData.status === "resolved");

  // Search functionality
  const filteredCases = myCases.filter(caseData =>
    caseData.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    caseData.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="text-white text-2xl" />
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
          onCreateCase={() => setShowCreateModal(true)}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-2">My Cases</h1>
            <p className="text-slate-600 dark:text-muted-foreground">
              Manage and track your clinical cases and their discussions
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{myCases.length}</p>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground">Total Cases</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{myActiveCases.length}</p>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-card rounded-lg border border-slate-200 dark:border-border p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-foreground">{myResolvedCases.length}</p>
                  <p className="text-sm text-slate-600 dark:text-muted-foreground">Resolved Cases</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cases Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Cases ({myCases.length})</TabsTrigger>
              <TabsTrigger value="active">Active ({myActiveCases.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({myResolvedCases.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              <CasesGrid 
                cases={searchQuery ? filteredCases : myCases}
                loading={casesLoading}
                onCaseClick={setSelectedCase}
                onCreateCase={() => setShowCreateModal(true)}
                emptyMessage="You haven't created any cases yet."
              />
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <CasesGrid 
                cases={myActiveCases}
                loading={casesLoading}
                onCaseClick={setSelectedCase}
                onCreateCase={() => setShowCreateModal(true)}
                emptyMessage="No active cases. Create your first case to get started!"
              />
            </TabsContent>

            <TabsContent value="resolved" className="space-y-6">
              <CasesGrid 
                cases={myResolvedCases}
                loading={casesLoading}
                onCaseClick={setSelectedCase}
                onCreateCase={() => setShowCreateModal(true)}
                emptyMessage="No resolved cases yet."
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <CreateCaseModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {selectedCase && (
        <CaseDetailsModal
          caseId={selectedCase}
          open={!!selectedCase}
          onOpenChange={(open) => !open && setSelectedCase(null)}
        />
      )}
    </div>
  );
}

interface CasesGridProps {
  cases: CaseWithAuthor[];
  loading: boolean;
  onCaseClick: (id: number) => void;
  onCreateCase: () => void;
  emptyMessage: string;
}

function CasesGrid({ cases, loading, onCaseClick, onCreateCase, emptyMessage }: CasesGridProps) {
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
          <FileText className="text-slate-400 dark:text-muted-foreground text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No cases found</h3>
        <p className="text-slate-600 dark:text-muted-foreground mb-4">{emptyMessage}</p>
        <Button
          onClick={onCreateCase}
          className="bg-medical-blue hover:bg-medical-blue-dark text-white"
        >
          Create Your First Case
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {cases.map((caseData) => (
        <CaseCard
          key={caseData.id}
          case={caseData}
          onClick={() => onCaseClick(caseData.id)}
        />
      ))}
    </div>
  );
}