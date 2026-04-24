"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const allMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["ADMIN", "USER"] },
  { icon: Users, label: "Pessoas", href: "/dashboard/people", roles: ["ADMIN", "USER"] },
  { icon: Wallet, label: "Finanças", href: "/dashboard/finance", roles: ["ADMIN"] },
  { icon: Settings, label: "Configurações", href: "/dashboard/settings", roles: ["ADMIN"] },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const userRole = user?.role || "USER";
  const userInitials = user?.name 
    ? user.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  const permittedMenu = allMenuItems.filter(item => item.roles.includes(userRole));

  if (loading) return null;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800/50 bg-zinc-900/90 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-zinc-900/30",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img 
              src="/LOGO TRUE BRANCO.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-zinc-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {permittedMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                pathname === item.href 
                  ? "bg-zinc-50 text-zinc-950 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                pathname === item.href ? "text-zinc-950" : "text-zinc-500 group-hover:text-zinc-300"
              )} />
              {item.label}
              {pathname === item.href && <ChevronRight className="ml-auto w-4 h-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800/50">
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="lg:inline">Sair do Sistema</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-4 lg:px-8 gap-4 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-zinc-400"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="lg:hidden">
               <img src="/LOGO TRUE BRANCO.png" alt="Logo" className="h-6 w-auto" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
              <p className="text-xs text-zinc-500">
                {user?.role === "ADMIN" ? "Diretor / Admin" : "Boas Vindas"}
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 shrink-0">
              <span className="text-sm font-bold tracking-wider">{userInitials}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
