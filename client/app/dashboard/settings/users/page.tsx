"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  MoreHorizontal, 
  ShieldCheck,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
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

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("USER");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get("/users");
      setUsers(data);
    } catch (error) {
      toast.error("Erro ao carregar usuários ou acesso negado.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await api.post("/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });
      
      setUsers([...users, newUser]);
      toast.success(`${newName} adicionado com sucesso!`);
      setIsAddDialogOpen(false);
      
      // Reset Form
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("USER");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar usuário");
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Tem certeza que deseja remover o acesso de ${name}?`)) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
      toast.success("Usuário removido.");
    } catch (error: any) {
      toast.error(error.message || "Erro ao remover");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Gestão de Usuários</h1>
          <p className="text-zinc-500">Controle o acesso e as permissões de equipe no sistema.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
              <UserPlus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Novo Usuário</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Crie um novo acesso para membros da equipe.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Nome do membro"
                    className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email (Login)</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@esemplo.com"
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-300">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Nível de Acesso</Label>
                  <Select value={newRole} onValueChange={setNewRole}>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Selecione o acesso" />
                    </SelectTrigger>
                    <SelectContent className="glass border-zinc-800 text-zinc-100">
                      <SelectItem value="USER">Boas Vindas (Recepção)</SelectItem>
                      <SelectItem value="ADMIN">Diretor (Admin)</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Button type="submit" className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold">
                  Cadastrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card className="glass border-zinc-800/50">
          <CardContent className="pt-6">
            <div className="rounded-md border border-zinc-800/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-900/50">
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="text-zinc-400">Usuário</TableHead>
                    <TableHead className="text-zinc-400">Nível de Acesso</TableHead>
                    <TableHead className="text-right text-zinc-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-100">{u.name}</span>
                          <span className="text-xs text-zinc-500">{u.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                          u.role === "ADMIN" ? "bg-amber-400/10 text-amber-400" : "bg-blue-400/10 text-blue-400"
                        )}>
                          {u.role === "ADMIN" ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                          {u.role === "ADMIN" ? "Diretor" : "Boas Vindas"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="h-8 text-red-500 hover:text-red-400 hover:bg-red-400/10"
                        >
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-zinc-500">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
