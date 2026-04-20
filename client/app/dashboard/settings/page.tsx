"use client";

import { useRouter } from "next/navigation";
import { 
  Settings, 
  Bell, 
  Lock, 
  User as UserIcon, 
  Database,
  Palette,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
  { 
    title: "Gestão de Usuários", 
    desc: "Adicione diretores ou recepcionistas ao sistema.",
    icon: Users,
    href: "/dashboard/settings/users"
  },
  { 
    title: "Perfil do Usuário", 
    desc: "Gerencie suas informações pessoais e foto de perfil.",
    icon: UserIcon
  },
  { 
    title: "Segurança", 
    desc: "Altere sua senha e configure a autenticação em dois fatores.",
    icon: Lock
  },
  { 
    title: "Notificações", 
    desc: "Escolha quais alertas você deseja receber por email ou push.",
    icon: Bell
  },
  { 
    title: "Aparência", 
    desc: "Personalize as cores do sistema e o modo claro/escuro.",
    icon: Palette
  },
  { 
    title: "Dados e Backup", 
    desc: "Exporte seus dados ou gerencie backups automáticos.",
    icon: Database
  },
];

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Configurações</h1>
        <p className="text-zinc-500">Ajuste as preferências do sistema e da sua conta.</p>
      </div>

      <div className="grid gap-6 max-w-4xl">
        {sections.map((section) => (
          <Card 
            key={section.title} 
            className="glass border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 cursor-pointer group"
            onClick={() => handleNavigation(section.href)}
          >
            <CardHeader className="flex flex-row items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <section.icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-100" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-display text-zinc-100">{section.title}</CardTitle>
                <CardDescription className="text-zinc-500">{section.desc}</CardDescription>
              </div>
              <Button variant="ghost" className="text-zinc-500 hover:text-zinc-100">Gerenciar</Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
