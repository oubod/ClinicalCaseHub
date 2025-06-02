import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, MessageCircle, FileText } from "lucide-react";
import type { User } from "../shared/schema";

export default function Colleagues() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Mock data for demonstration - in real app, this would come from API
  const colleagues: User[] = [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@hospital.com",
      specialty: "Cardiology",
      role: "doctor",
      hospital: "Metro General Hospital",
      department: "Cardiovascular Medicine",
      bio: "Interventional cardiologist with expertise in complex coronary procedures and structural heart disease.",
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2", 
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@hospital.com",
      specialty: "Neurology",
      role: "doctor",
      hospital: "Metro General Hospital",
      department: "Neurosciences",
      bio: "Neurologist specializing in stroke care and neurocritical care medicine.",
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@hospital.com", 
      specialty: "Emergency Medicine",
      role: "doctor",
      hospital: "Metro General Hospital",
      department: "Emergency Department",
      bio: "Emergency physician with focus on trauma care and critical care medicine.",
      profileImageUrl: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const filteredColleagues = colleagues.filter(colleague =>
    !searchQuery || 
    colleague.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colleague.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colleague.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    colleague.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-background">
        <div className="text-center">
          <div className="w-16 h-16 bg-medical-blue rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="text-white text-2xl" />
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
          onSearch={() => {}}
          onCreateCase={() => {}}
        />
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-foreground mb-2">Colleagues</h1>
            <p className="text-slate-600 dark:text-muted-foreground">
              Connect with fellow healthcare professionals and collaborate on cases
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search colleagues by name, specialty, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
            </div>
          </div>

          {/* Colleagues Grid */}
          {filteredColleagues.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-200 dark:bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-slate-400 dark:text-muted-foreground text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-foreground mb-2">No colleagues found</h3>
              <p className="text-slate-600 dark:text-muted-foreground">
                {searchQuery ? `No colleagues found matching "${searchQuery}"` : "No colleagues available"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleagues.map((colleague) => (
                <Card key={colleague.id} className="bg-white dark:bg-card border border-slate-200 dark:border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={colleague.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(colleague.firstName + ' ' + colleague.lastName || 'User')}&background=2563eb&color=fff`}
                        alt={`${colleague.firstName} ${colleague.lastName}`}
                        className="w-16 h-16 rounded-full object-cover" 
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-foreground">
                          Dr. {colleague.firstName} {colleague.lastName}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-muted-foreground">
                          {colleague.specialty}
                        </p>
                        <Badge className="mt-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {colleague.department}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {colleague.hospital && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Hospital</p>
                        <p className="text-sm text-slate-600 dark:text-muted-foreground">{colleague.hospital}</p>
                      </div>
                    )}
                    
                    {colleague.bio && (
                      <div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">About</p>
                        <p className="text-sm text-slate-600 dark:text-muted-foreground line-clamp-3">
                          {colleague.bio}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Cases
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}