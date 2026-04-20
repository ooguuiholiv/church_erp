"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle,
  Search,
  Download,
  FileText,
  DollarSign,
  Tag
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { api } from "@/lib/api";

const initialTransactions: any[] = [];
const initialCategories: any[] = [];

export default function FinancePage() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [categories, setCategories] = useState(initialCategories);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpense: 0, balance: 0 });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("RECEITA");
  const [categoryId, setCategoryId] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transData, catData, summaryData] = await Promise.all([
        api.get("/finance"),
        api.get("/categories"),
        api.get("/finance/summary")
      ]);
      setTransactions(transData);
      setCategories(catData);
      setSummary(summaryData);
      setFilteredCategories(catData.filter((c: any) => c.type === "RECEITA"));
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros");
    } finally {
      setIsLoading(false);
    }
  };

  // Update categories when type changes
  useEffect(() => {
    const filtered = categories.filter(c => c.type === type);
    setFilteredCategories(filtered);
    setCategoryId(""); // Reset category when type changes
  }, [type, categories]);

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTransaction = await api.post("/finance", {
        description,
        amount: parseFloat(amount),
        type,
        categoryId,
        date: new Date().toISOString(),
      });
      
      toast.success("Transação registrada com sucesso!");
      setIsAddDialogOpen(false);
      fetchData(); // Refresh all data
      
      // Reset Form
      setDescription("");
      setAmount("");
      setType("RECEITA");
      setCategoryId("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Gestão Financeira</h1>
          <p className="text-zinc-500">Controle de fluxo de caixa, dízimos e ofertas.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/finance/categories">
            <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 gap-2">
              <Tag className="w-4 h-4" />
              Gestão de Categorias
            </Button>
          </Link>
          <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 gap-2">
            <Download className="w-4 h-4" />
            Relatórios
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
                <PlusCircle className="w-4 h-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">Nova Transação</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Registre uma nova entrada ou saída de caixa.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTransaction} className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="desc" className="text-zinc-300">Descrição</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="desc"
                        placeholder="Ex: Dízimo Mensal - João"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-zinc-300">Valor (R$)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-300">Tipo</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="glass border-zinc-800 text-zinc-100">
                          <SelectItem value="RECEITA" className="text-emerald-400">Receita (+)</SelectItem>
                          <SelectItem value="DESPESA" className="text-rose-400">Despesa (-)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Categoria Modular</Label>
                    <Select value={categoryId} onValueChange={setCategoryId} disabled={!type}>
                      <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                        <SelectValue placeholder={type ? "Selecione a categoria" : "Selecione o tipo primeiro"} />
                      </SelectTrigger>
                      <SelectContent className="glass border-zinc-800 text-zinc-100">
                        {filteredCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-[10px] text-zinc-500 italic">As categorias acima são filtradas automaticamente pelo tipo selecionado.</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsAddDialogOpen(false)}
                    className="text-zinc-400 hover:text-zinc-100"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold" disabled={!categoryId}>
                    Registrar Transação
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Receitas Acumuladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              {summary.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Despesas Acumuladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">
              {summary.totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-zinc-800/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Saldo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-50">
              {summary.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="glass border-zinc-800/50">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-lg font-display">Transações Recentes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Buscar transação..."
                className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-zinc-800/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-zinc-900/50">
                <TableRow className="hover:bg-transparent border-zinc-800">
                  <TableHead className="text-zinc-400">Descrição</TableHead>
                  <TableHead className="text-zinc-400">Categoria</TableHead>
                  <TableHead className="text-zinc-400">Data</TableHead>
                  <TableHead className="text-right text-zinc-400">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                    <TableCell className="font-medium text-zinc-100">{t.desc}</TableCell>
                    <TableCell>
                      <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 uppercase font-semibold">
                        {t.category.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">{t.date}</TableCell>
                    <TableCell className={cn(
                      "text-right font-semibold",
                      t.type === "RECEITA" ? "text-emerald-400" : "text-rose-400"
                    )}>
                      {t.type === "RECEITA" ? "+" : ""} {t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
