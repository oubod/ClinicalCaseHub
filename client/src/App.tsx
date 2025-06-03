import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Home from "@/pages/home";
import MyCases from "@/pages/my-cases";
import Featured from "@/pages/featured";
import Colleagues from "@/pages/colleagues";
import Notifications from "@/pages/notifications";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      {/* If not authenticated, show landing page at root */}
      <Route path="/">
        {() => (!isAuthenticated ? <Landing /> : <Home />)}
      </Route>
      {/* Protected routes */}
      <Route path="/my-cases">
        {() => (isAuthenticated ? <MyCases /> : <Login />)}
      </Route>
      <Route path="/featured">
        {() => (isAuthenticated ? <Featured /> : <Login />)}
      </Route>
      <Route path="/colleagues">
        {() => (isAuthenticated ? <Colleagues /> : <Login />)}
      </Route>
      <Route path="/notifications">
        {() => (isAuthenticated ? <Notifications /> : <Login />)}
      </Route>
      {/* 404 route */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
