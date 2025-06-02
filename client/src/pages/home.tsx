import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FiltersBar from "@/components/FiltersBar";
import { CaseCard } from "@/components/CaseCard";
import { CreateCaseModal } from "@/components/CreateCaseModal";
import { CaseDetailsModal } from "@/components/CaseDetailsModal";
import { Button } from "@/components/ui/button";
import type { CaseWithAuthor } from "../shared/schema";
import { insertCaseSchema } from "../shared/schema";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [filters, setFilters] = useState({
    specialty: "All Specialties",
    status: "All Status",
    search: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const queryClient = useQueryClient();

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

  const { data: cases = [], isLoading: casesLoading, error } = useQuery({
    queryKey: ["/api/cases", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.specialty !== "All Specialties") params.append("specialty", filters.specialty);
      if (filters.status !== "All Status") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      
      const response = await fetch(`/api/cases?${params}`);
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<CaseWithAuthor[]>;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error, toast]);

  const onCaseClick = (id: string) => {
    setSelectedCase(id);
    setShowCaseModal(true);
  };

  const handleCreateCase = async (data: z.infer<typeof insertCaseSchema>) => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create case');
      }

      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setShowCreateModal(false);
      toast({
        title: 'Success',
        description: 'Case created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create case',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-stethoscope text-white text-2xl"></i>
          </div>
          <p className="text-slate-600 dark:text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-background">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={(search) => setFilters(prev => ({ ...prev, search }))}
          onCreateCase={() => setShowCreateModal(true)}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <FiltersBar
            filters={filters}
            onFiltersChange={setFilters}
          />
          
          {casesLoading ? (
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
                  <div className="h-4 bg-slate-200 dark:bg-muted rounded w-2/3 mb-4"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-slate-200 dark:bg-muted rounded w-16"></div>
                    <div className="h-6 bg-slate-200 dark:bg-muted rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-slate-200 dark:bg-muted rounded w-16"></div>
                    <div className="h-4 bg-slate-200 dark:bg-muted rounded w-12"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-200 dark:bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-file-medical text-slate-400 dark:text-muted-foreground text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No cases found</h3>
              <p className="text-slate-600 dark:text-muted-foreground mb-4">
                {filters.search || filters.specialty !== "All Specialties" || filters.status !== "All Status"
                  ? "Try adjusting your filters to see more cases."
                  : "Be the first to share a clinical case with your colleagues."}
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-medical-blue hover:bg-medical-blue-dark text-white"
              >
                Create First Case
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {cases.map((caseData) => (
                  <CaseCard
                    key={caseData.id}
                    caseData={caseData}
                    onClick={() => onCaseClick(caseData.id)}
                  />
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="border-medical-blue text-medical-blue hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  Load More Cases
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <CreateCaseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCase}
      />

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
