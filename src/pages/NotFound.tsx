
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 text-primary">404</h1>
        <p className="text-xl md:text-2xl mb-6 text-foreground">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          We couldn't find the page you were looking for. It might have been moved or doesn't exist.
        </p>
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home size={18} />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
