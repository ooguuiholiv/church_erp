"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function DashboardHome() {
  const [statsData, setStatsData] = useState({
    totalMembers: 0,
    monthlyRevenue: 0,
    monthlyExpense: 0,
    balance: 0
  });
  
  const [activities, setActivities] = useState<any[]>([]);
  const [journeyStats, setJourneyStats] = useState({
    conversionRate: 0,
    retentionRate: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState("USER");
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    let role = "USER";
    if (userData) {
      const parsed = JSON.parse(userData);
      role = parsed.role;
      setUserRole(role);
      setUserName(parsed.name?.split(" ")[0] || "Usuário");
    }
    fetchDashboardData(role);
  }, []);

  const fetchDashboardData = async (role: string) => {
    try {
      const [people, financeSummary, transactions] = await Promise.all([
        api.get("/people"),
        role === "ADMIN" ? api.get("/finance/summary") : Promise.resolve({ totalRevenue: 0, totalExpense: 0, balance: 0 }),
        role === "ADMIN" ? api.get("/finance") : Promise.resolve([])
      ]);

      // Atividades Recentes
      const peopleActivities = people.map((p: any) => ({
        id: `person-${p.id}`,
        action: "Novo Cadastro",
        details: `${p.name} cadastrado(a)`,
        date: new Date(p.createdAt),
        type: "person"
      }));

      const financeActivities = transactions.map((t: any) => ({
        id: `finance-${t.id}`,
        action: t.type === "RECEITA" ? "Receita Adicionada" : "Despesa Lançada",
        details: `${t.description} - R$ ${Number(t.amount).toFixed(2)}`,
        date: new Date(t.createdAt),
        type: "finance"
      }));

      const allActivities = [...peopleActivities, ...financeActivities]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 4)
        .map(a => ({
           ...a,
           time: formatDistanceToNow(a.date, { addSuffix: true, locale: ptBR })
        }));

      setActivities(allActivities);

      // Resumo da Jornada
      const totalPeople = people.length;
      const convertedPeople = people.filter((p: any) => p.status !== "VISITANTE").length;
      const members = people.filter((p: any) => p.status === "MEMBRO").length;

      const conversion = totalPeople > 0 ? (convertedPeople / totalPeople) * 100 : 0;
      const retention = convertedPeople > 0 ? (members / convertedPeople) * 100 : 0;

      setJourneyStats({
        conversionRate: Math.round(conversion),
        retentionRate: Math.round(retention)
      });

      setStatsData({
        totalMembers: people.length,
        monthlyRevenue: financeSummary.totalRevenue,
        monthlyExpense: financeSummary.totalExpense,
        balance: financeSummary.balance
      });
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setIsLoading(false);
    }
  };

  const dashboardStats = [
    { 
      title: "Total de Membros", 
      value: statsData.totalMembers.toString(), 
      icon: Users,
      color: "text-blue-400",
      roles: ["ADMIN", "USER"]
    },
    { 
      title: "Receita (Mês)", 
      value: statsData.monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
      icon: TrendingUp,
      color: "text-emerald-400",
      roles: ["ADMIN"]
    },
    { 
      title: "Despesas (Mês)", 
      value: statsData.monthlyExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
      icon: TrendingDown,
      color: "text-rose-400",
      roles: ["ADMIN"]
    },
    { 
      title: "Saldo em Caixa", 
      value: statsData.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
      icon: Wallet,
      color: "text-amber-400",
      roles: ["ADMIN"]
    },
  ];

  const visibleStats = dashboardStats.filter(s => s.roles.includes(userRole));

  if (isLoading) {
    return <div className="p-8 text-zinc-400 animate-pulse">Carregando métricas...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Bem-vindo, {userName}</h1>
        <p className="text-zinc-500">Aqui está um resumo do que está acontecendo na sua igreja hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((stat) => (
          <Card key={stat.title} className="glass border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-zinc-400">{stat.title}</CardTitle>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="glass border-zinc-800/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Activity className="w-5 h-5 text-zinc-400" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activities.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">Nenhuma atividade registrada ainda.</p>
            ) : (
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2 shrink-0",
                      activity.type === "person" ? "bg-blue-400" : "bg-emerald-400"
                    )} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action}</p>
                      <p className="text-xs text-zinc-500">{activity.details}</p>
                    </div>
                    <div className="text-xs text-zinc-600 italic">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Journey Summary */}
        <Card className="glass border-zinc-800/50">
          <CardHeader>
            <CardTitle className="text-lg font-display">Resumo da Jornada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Conversão de Visitantes</span>
                  <span className="text-zinc-100">{journeyStats.conversionRate}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${journeyStats.conversionRate}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-400">Retenção de Membros</span>
                  <span className="text-zinc-100">{journeyStats.retentionRate}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${journeyStats.retentionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
