"use client";

import { useState, useEffect } from "react";
import { 
  MoreHorizontal,
  PlusCircle,
  Search,
  Download,
  FileText,
  DollarSign,
  Tag,
  Trash2,
  Pencil
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

import { api } from "@/lib/api";

export default function FinancePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, totalExpense: 0, balance: 0 });
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  
  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("RECEITA");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState("");
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
      
      const currentType = dialogMode === "edit" && selectedTransaction ? selectedTransaction.type : type;
      setFilteredCategories(catData.filter((c: any) => c.type === currentType));
    } catch (error) {
      toast.error("Erro ao carregar dados financeiros");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = categories.filter(c => c.type === type);
    setFilteredCategories(filtered);
    if (dialogMode === "add") {
       setCategoryId(""); 
    }
  }, [type, categories, dialogMode]);

  const handleOpenAdd = () => {
    setDialogMode("add");
    setSelectedTransaction(null);
    setDescription("");
    setAmount("");
    setType("RECEITA");
    setCategoryId("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsFormDialogOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setDialogMode("edit");
    setSelectedTransaction(t);
    setDescription(t.description);
    setAmount(t.amount.toString());
    setType(t.type);
    setCategoryId(t.categoryId);
    setDate(t.date ? t.date.split("T")[0] : "");
    setIsFormDialogOpen(true);
  };

  const handleOpenDelete = (t: any) => {
    setSelectedTransaction(t);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        description,
        amount: parseFloat(amount),
        type,
        categoryId,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
      };

      if (dialogMode === "add") {
        await api.post("/finance", payload);
        toast.success("Transação registrada com sucesso!");
      } else {
        await api.patch(`/finance/${selectedTransaction.id}`, payload);
        toast.success("Transação atualizada com sucesso!");
      }
      
      setIsFormDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/finance/${selectedTransaction.id}`);
      toast.success("Transação removida!");
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const datePart = dateStr.split("T")[0];
      const [year, month, day] = datePart.split("-");
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
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
          
          <Button onClick={handleOpenAdd} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
            <PlusCircle className="w-4 h-4" />
            Nova Transação
          </Button>
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
                  <TableHead className="text-right text-zinc-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">Carregando...</TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-zinc-500">Nenhuma transação encontrada.</TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id} className="border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                      <TableCell className="font-medium text-zinc-100">{t.description}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 uppercase font-semibold">
                          {t.category.name}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-500 text-sm">
                        {formatDateLabel(t.date)}
                      </TableCell>
                      <TableCell className={cn(
                        "text-right font-semibold",
                        t.type === "RECEITA" ? "text-emerald-400" : "text-rose-400"
                      )}>
                        {t.type === "RECEITA" ? "+" : ""} {Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-zinc-800 text-zinc-300">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer flex gap-2" onClick={() => handleOpenEdit(t)}>
                              <Pencil className="w-4 h-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer flex gap-2" onClick={() => handleOpenDelete(t)}>
                              <Trash2 className="w-4 h-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {dialogMode === "add" ? "Nova Transação" : "Editar Transação"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {dialogMode === "add" ? "Registre uma nova entrada ou saída de caixa." : "Altere os dados da transação selecionada."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTransaction} className="space-y-6 py-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-zinc-300">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    style={{ colorScheme: "dark" }}
                    className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Categoria</Label>
                  <Select value={categoryId} onValueChange={setCategoryId} disabled={!type}>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent className="glass border-zinc-800 text-zinc-100">
                      {filteredCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormDialogOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold" disabled={isSubmitting || !categoryId}>
                {isSubmitting ? "Salvando..." : (dialogMode === "add" ? "Registrar" : "Salvar Alteração")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold text-red-500">Excluir Transação</DialogTitle>
            <DialogDescription className="text-zinc-400 mt-2">
              Tem certeza que deseja remover esta transação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex gap-2">
             <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button onClick={handleDeleteTransaction} disabled={isSubmitting} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 font-semibold transition-colors">
                {isSubmitting ? "Excluindo..." : "Excluir permanentemente"}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
