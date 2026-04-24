"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Essential for HttpOnly cookies
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Credenciais inválidas");
      }

      toast.success("Login realizado com sucesso!");
      
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 relative overflow-hidden">
      {/* Background Animated Gradient Meshes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse duration-[8000ms]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse duration-[10000ms] delay-1000"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-violet-500/5 rounded-full blur-[100px] animate-pulse duration-[6000ms] delay-500"></div>
      </div>

      <div className="w-full max-w-md px-4 relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <Card className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] !rounded-2xl overflow-hidden">
          {/* Subtle top glare */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          <CardHeader className="space-y-2 text-center pt-10 pb-6 px-8">
            <div className="flex justify-center pb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img 
                  src="/LOGO TRUE BRANCO.png" 
                  alt="Church Logo" 
                  className="h-28 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            <CardTitle className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-500 tracking-tight">
              Portal Administrativo
            </CardTitle>
            <CardDescription className="text-zinc-400 font-medium">
              Entre com suas credenciais para gerenciar sua igreja
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin} className="px-8 pb-10 space-y-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-zinc-300 text-sm font-semibold ml-1">Email</Label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@igreja.com"
                    className="h-11 pl-11 bg-zinc-950/50 border border-zinc-800/80 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500 rounded-xl transition-all shadow-inner"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-zinc-300 text-sm font-semibold">Senha</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    className="h-11 pl-11 bg-zinc-950/50 border border-zinc-800/80 text-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-600 focus-visible:border-zinc-500 rounded-xl transition-all shadow-inner"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-5">
              <Button 
                type="submit" 
                className="w-full h-11 bg-zinc-100 text-zinc-950 hover:bg-white hover:scale-[1.02] shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all duration-300 font-bold text-base rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? "Acessando..." : "Entrar no Sistema"}
              </Button>
              <p className="text-center text-sm text-zinc-500">
                Esqueceu sua senha? <a href="#" className="text-zinc-300 hover:text-white transition-colors hover:underline">Recuperar</a>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
