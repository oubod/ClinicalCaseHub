import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';

interface PrivateRouteProps {
  component: React.ComponentType<any>;
}

export default function PrivateRoute({ component: Component }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // If loading, return null or a loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  // If authenticated, render the protected component
  return <Component />;
}
