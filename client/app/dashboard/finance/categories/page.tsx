"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ArrowLeft,
  Tag,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { api } from "@/lib/api";

const initialCategories: any[] = [];

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("RECEITA");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Erro ao carregar categorias");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    try {
      const newCat = await api.post("/categories", {
        name: newName,
        type: newType,
      });

      setCategories([...categories, newCat]);
      setNewName("");
      toast.success(`Categoria "${newName}" adicionada!`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      toast.info("Categoria removida.");
    } catch (error) {
      toast.error("Erro ao excluir");
    }
  };

  const revenues = categories.filter(c => c.type === "RECEITA");
  const expenses = categories.filter(c => c.type === "DESPESA");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/finance">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-zinc-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Categorias Financeiras</h1>
          <p className="text-zinc-500">Gerencie as categorias de receitas e despesas do sistema.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Add Category Form */}
        <Card className="glass border-zinc-800/50 h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-display">Nova Categoria</CardTitle>
            <CardDescription>Adicione uma nova opção ao plano de contas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name" className="text-zinc-300">Nome da Categoria</Label>
                <Input
                  id="cat-name"
                  placeholder="Ex: Aluguel, Oferta Missões..."
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Tipo</Label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="glass border-zinc-800 text-zinc-100">
                    <SelectItem value="RECEITA" className="text-emerald-400">Receita (+)</SelectItem>
                    <SelectItem value="DESPESA" className="text-rose-400">Despesa (-)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
                <Plus className="w-4 h-4" />
                Cadastrar
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Categories Lists */}
        <div className="md:col-span-2 space-y-8">
          {/* Revenues Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-semibold">
              <TrendingUp className="w-5 h-5" />
              <h2>Categorias de Receita</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {revenues.map((cat) => (
                <div key={cat.id} className="glass border-zinc-800/50 p-4 rounded-xl flex items-center justify-between group hover:border-emerald-400/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-zinc-200 font-medium">{cat.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(cat.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-zinc-800/50" />

          {/* Expenses Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-display font-semibold">
              <TrendingDown className="w-5 h-5" />
              <h2>Categorias de Despesa</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {expenses.map((cat) => (
                <div key={cat.id} className="glass border-zinc-800/50 p-4 rounded-xl flex items-center justify-between group hover:border-rose-400/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-400/10 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-rose-400" />
                    </div>
                    <span className="text-zinc-200 font-medium">{cat.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(cat.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
