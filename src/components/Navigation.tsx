import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Search, 
  GitCompareArrows, 
  TrendingUp,
  Brain,
  LogIn
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Search,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: TrendingUp,
  },
  {
    name: "Comparison",
    href: "/comparison",
    icon: GitCompareArrows,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

const Navigation = () => {
  return (
    <nav className="bg-card border-b shadow-soft">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 ">
              <img 
                src="/logo.png" 
                alt="Web Navigator AI Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Web Navigator AI
              </h1>
              <p className="text-xs text-muted-foreground">Intelligent Data Agent</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </NavLink>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <NavLink to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </NavLink>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;