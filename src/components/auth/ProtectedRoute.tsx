import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getCurrentSession } from "@/lib/auth/studentAuthService";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      const session = await getCurrentSession();
      if (!mounted) return;
      setIsAuthenticated(Boolean(session?.user));
      setChecking(false);
    };

    void check();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/student/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
