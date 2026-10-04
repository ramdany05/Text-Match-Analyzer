import { NavLink, useNavigate } from "react-router";
import { LogOut, LayoutDashboard, History } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Anda telah logout.");
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b border-border bg-card/90 sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand & Navigation Tabs */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded border border-border bg-foreground text-background flex items-center justify-center font-mono font-bold text-xs">
              TM
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground hidden sm:inline-block">
              Text Match Analyzer
            </span>
          </div>

          {/* Notion-style Nav Tabs */}
          <nav className="flex items-center gap-1 font-sans text-xs">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Workspace</span>
            </NavLink>

            <NavLink
              to="/history"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground font-semibold border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <History className="h-3.5 w-3.5" />
              <span>Riwayat</span>
            </NavLink>
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="h-8 text-xs font-mono gap-1.5 border-border hover:bg-muted"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
