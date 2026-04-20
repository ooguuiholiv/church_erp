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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

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
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const profile = await api.get("/auth/profile");
        setUser(profile);
      } catch (error) {
        console.error("Erro de autenticação");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const userRole = user?.role || "USER";
  const userInitials = user?.name 
    ? user.name.split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  const permittedMenu = allMenuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm flex flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img 
              src="/LOGO TRUE BRANCO.png" 
              alt="Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {permittedMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                pathname === item.href 
                  ? "bg-zinc-50 text-zinc-950 font-semibold" 
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
            Sair do Sistema
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-end px-8 gap-4 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
              <p className="text-xs text-zinc-500">
                {user?.role === "ADMIN" ? "Diretor / Admin" : "Boas Vindas"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
              <span className="text-sm font-bold tracking-wider">{userInitials}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
