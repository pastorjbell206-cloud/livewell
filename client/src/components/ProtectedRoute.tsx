import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

interface ProtectedRouteProps {
    component: React.ComponentType;
    /** Role required to access this route. Defaults to any authenticated user. */
  requireAdmin?: boolean;
}

/**
 * ProtectedRoute — wraps a page component and redirects unauthenticated
 * (or non-admin) users to the login page before rendering anything.
 *
 * Usage in App.tsx:
 *   <Route path="/admin" component={() => <ProtectedRoute component={AdminDashboard} requireAdmin />} />
 */
export default function ProtectedRoute({
    component: Component,
    requireAdmin = false,
}: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();
    const [, setLocation] = useLocation();

  useEffect(() => {
        if (isLoading) return;

                if (!user) {
                        // Not logged in — redirect to login
          setLocation("/admin/login");
                        return;
                }

                if (requireAdmin && user.role !== "admin") {
                        // Logged in but not an admin — redirect to home
          setLocation("/");
                }
  }, [user, isLoading, requireAdmin, setLocation]);

  // Show nothing while checking auth state
  if (isLoading) {
        return (
                <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>div>
          );
  }
  
    // Redirect is handled by useEffect above; render null while it completes
    if (!user) return null;
    if (requireAdmin && user.role !== "admin") return null;
  
    return <Component />;
}</div>
