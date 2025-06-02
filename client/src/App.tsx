import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import { queryClient } from "@/lib/queryClient";
import PrivateRoute from "@/components/PrivateRoute";
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
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Landing page - show only when not authenticated */}
      <Route path="/">
        {() => (!isAuthenticated ? <Landing /> : <Home />)}
      </Route>

      {/* Protected routes */}
      <Route path="/my-cases">
        {() => <PrivateRoute component={MyCases} />}
      </Route>
      <Route path="/featured">
        {() => <PrivateRoute component={Featured} />}
      </Route>
      <Route path="/colleagues">
        {() => <PrivateRoute component={Colleagues} />}
      </Route>
      <Route path="/notifications">
        {() => <PrivateRoute component={Notifications} />}
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
