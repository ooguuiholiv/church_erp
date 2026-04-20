"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  MoreHorizontal, 
  Search,
  Filter,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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

import { api } from "@/lib/api";

const initialPeople: any[] = [];

export default function PeoplePage() {
  const [people, setPeople] = useState(initialPeople);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStatus, setNewStatus] = useState("VISITANTE");

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const data = await api.get("/people");
      setPeople(data);
    } catch (error) {
      toast.error("Erro ao carregar membros");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newPerson = await api.post("/people", {
        name: newName,
        email: newEmail || undefined,
        phone: newPhone || undefined,
        status: newStatus,
      });
      
      setPeople([newPerson, ...people]);
      toast.success(`${newName} cadastrado(a) com sucesso!`);
      setIsAddDialogOpen(false);
      
      // Reset Form
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewStatus("VISITANTE");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar");
    }
  };

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Membros e Visitantes</h1>
          <p className="text-zinc-500">Gerencie a jornada e o engajamento das pessoas na igreja.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
              <UserPlus className="w-4 h-4" />
              Novo Cadastro
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Novo Cadastro</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Preencha os dados básicos para iniciar o acompanhamento da pessoa.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPerson} className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                    <Input
                      id="name"
                      placeholder="Ex: João da Silva"
                      className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@exemplo.com"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-zinc-300">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                      <Input
                        id="phone"
                        placeholder="(00) 00000-0000"
                        className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Status Inicial</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="glass border-zinc-800 text-zinc-100">
                      <SelectItem value="VISITANTE">Visitante</SelectItem>
                      <SelectItem value="AMIGO">Amigo</SelectItem>
                      <SelectItem value="PARTICIPANTE">Participante</SelectItem>
                      <SelectItem value="MEMBRO">Membro</SelectItem>
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
                  Salvar Cadastro
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        <Card className="glass border-zinc-800/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Pesquisar por nome ou email..."
                  className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-zinc-800/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-900/50">
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="text-zinc-400">Nome</TableHead>
                    <TableHead className="text-zinc-400">Contato</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                    <TableHead className="text-right text-zinc-400">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPeople.map((person) => (
                    <TableRow key={person.id} className="border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-zinc-100">{person.name}</span>
                          <span className="text-xs text-zinc-500">{person.email || "Sem email"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {person.phone || "Sem telefone"}
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                          person.status === "MEMBRO" ? "bg-emerald-400/10 text-emerald-400" :
                          person.status === "PARTICIPANTE" ? "bg-blue-400/10 text-blue-400" :
                          person.status === "AMIGO" ? "bg-amber-400/10 text-amber-400" :
                          "bg-zinc-400/10 text-zinc-400"
                        )}>
                          {person.status}
                        </div>
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
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">Ver Perfil</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">Editar cadastro</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">Alterar status</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer">Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
