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
  User,
  MapPin,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
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
// Imports de data removidos a favor da string split nativa

import { api } from "@/lib/api";

const defaultFormData = {
  name: "",
  email: "",
  phone: "",
  birthDate: "",
  status: "VISITANTE",
  membershipDate: "",
  address: "",
  notes: ""
};

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog States
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setIsLoading(true);
    try {
      const data = await api.get("/people");
      setPeople(data);
    } catch (error) {
      toast.error("Erro ao carregar membros");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setDialogMode("add");
    setFormData(defaultFormData);
    setSelectedPerson(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEdit = (person: any) => {
    setDialogMode("edit");
    setSelectedPerson(person);
    setFormData({
      name: person.name || "",
      email: person.email || "",
      phone: person.phone || "",
      birthDate: person.birthDate ? person.birthDate.split("T")[0] : "",
      status: person.status || "VISITANTE",
      membershipDate: person.membershipDate ? person.membershipDate.split("T")[0] : "",
      address: person.address || "",
      notes: person.notes || ""
    });
    setIsFormDialogOpen(true);
  };

  const handleOpenView = (person: any) => {
    setSelectedPerson(person);
    setIsViewDialogOpen(true);
  };

  const handleOpenDelete = (person: any) => {
    setSelectedPerson(person);
    setIsDeleteDialogOpen(true);
  };

  const handleSavePerson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        status: formData.status,
        address: formData.address || null,
        notes: formData.notes || null,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        membershipDate: formData.membershipDate ? new Date(formData.membershipDate).toISOString() : null,
      };

      if (dialogMode === "add") {
        await api.post("/people", payload);
        toast.success(`${formData.name} cadastrado(a) com sucesso!`);
      } else {
        await api.patch(`/people/${selectedPerson.id}`, payload);
        toast.success(`Cadastro de ${formData.name} atualizado!`);
      }
      
      await fetchPeople();
      setIsFormDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar os dados.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePerson = async () => {
    if (!selectedPerson) return;
    setIsSubmitting(true);
    try {
      await api.delete(`/people/${selectedPerson.id}`);
      toast.success("Pessoa excluída com sucesso.");
      await fetchPeople();
      setIsDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao excluir.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (personId: string, newStatus: string) => {
    try {
      await api.patch(`/people/${personId}/status`, { status: newStatus });
      toast.success(`Status atualizado para ${newStatus}`);
      await fetchPeople();
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar status.");
    }
  };

  const filteredPeople = people.filter(person => 
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (person.email && person.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      // Isola "2004-03-13" de "2004-03-13T00:00:00.000Z" evitando shifts de Timezone
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
          <h1 className="text-3xl font-display font-bold tracking-tight text-gradient">Membros e Visitantes</h1>
          <p className="text-zinc-500">Gerencie a jornada e o engajamento das pessoas na igreja.</p>
        </div>
        
        <Button onClick={handleOpenAdd} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold gap-2">
          <UserPlus className="w-4 h-4" />
          Novo Cadastro
        </Button>
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
            {isLoading ? (
              <div className="py-8 text-center text-zinc-500 animate-pulse">Carregando membros...</div>
            ) : (
            <div className="rounded-md border border-zinc-800/50 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-900/50">
                  <TableRow className="hover:bg-transparent border-zinc-800">
                    <TableHead className="text-zinc-400">Nome</TableHead>
                    <TableHead className="text-zinc-400">Contato</TableHead>
                    <TableHead className="text-zinc-400 whitespace-nowrap">Aniversário</TableHead>
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
                          <span className="text-xs text-zinc-500">{person.email || "Sem email registrado"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {person.phone || "Sem telefone"}
                      </TableCell>
                      <TableCell className="text-zinc-400 text-sm">
                        {formatDateLabel(person.birthDate)}
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
                            <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-100 focus-visible:ring-1 focus-visible:ring-zinc-700">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass border-zinc-800 text-zinc-300 w-44">
                            <DropdownMenuLabel className="text-xs text-zinc-500">Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={() => handleOpenView(person)}>Ver Perfil</DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={() => handleOpenEdit(person)}>Editar cadastro</DropdownMenuItem>
                            
                            <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer" onClick={() => {
                              setSelectedPerson(person);
                              setIsStatusDialogOpen(true);
                            }}>
                              Alterar status
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="bg-zinc-800" />
                            <DropdownMenuItem className="text-red-400 hover:bg-red-400/10 cursor-pointer" onClick={() => handleOpenDelete(person)}>Excluir</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredPeople.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                        Nenhuma pessoa encontrada.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog (Add / Edit) */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-bold">
              {dialogMode === "add" ? "Novo Cadastro" : "Editar Ficha"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {dialogMode === "add" 
                ? "Preencha as informações do novo integrante." 
                : "Atualize os dados e recadastre os registros da pessoa."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePerson} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-zinc-300">Nome Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="name"
                    placeholder="Ex: João da Silva"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@gmail.com"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-zinc-300">WhatsApp / Telefone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-zinc-300">Data de Nascimento</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="birthDate"
                    type="date"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 input-date-icon-hidden"
                    style={{ colorScheme: "dark" }}
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Status Na Igreja *</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
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

              <div className="space-y-2">
                <Label htmlFor="membershipDate" className="text-zinc-300">Data de Membrezia (Opcional)</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="membershipDate"
                    type="date"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    style={{ colorScheme: "dark" }}
                    value={formData.membershipDate}
                    onChange={(e) => setFormData({...formData, membershipDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-zinc-300">Endereço Completo</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    id="address"
                    placeholder="Rua Exemplo, 123 - Bairro"
                    className="pl-10 bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes" className="text-zinc-300">Anotações / Informações Extras</Label>
                <Textarea
                  id="notes"
                  placeholder="Informações familiares, pedidos de oração, restrições alimentares..."
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-700 min-h-[100px] resize-y"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormDialogOpen(false)}
                className="text-zinc-400 hover:text-zinc-100"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
                {isSubmitting ? "Salvando..." : (dialogMode === "add" ? "Cadastrar" : "Salvar Edição")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[600px]">
          <DialogHeader className="pb-4 border-b border-zinc-800/50">
            <DialogTitle className="text-2xl font-display font-bold flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300">
                {selectedPerson?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p>{selectedPerson?.name}</p>
                <div className={cn(
                  "inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-[10px] uppercase tracking-wider font-semibold",
                  selectedPerson?.status === "MEMBRO" ? "bg-emerald-400/10 text-emerald-400" :
                  selectedPerson?.status === "PARTICIPANTE" ? "bg-blue-400/10 text-blue-400" :
                  selectedPerson?.status === "AMIGO" ? "bg-amber-400/10 text-amber-400" :
                  "bg-zinc-400/10 text-zinc-400"
                )}>
                  {selectedPerson?.status}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 font-medium">Email</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Mail className="w-4 h-4 text-zinc-500" />
                {selectedPerson?.email || "Não informado"}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 font-medium">Telefone</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Phone className="w-4 h-4 text-zinc-500" />
                {selectedPerson?.phone || "Não informado"}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 font-medium">Data de Nascimento</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <CalendarIcon className="w-4 h-4 text-zinc-500" />
                {formatDateLabel(selectedPerson?.birthDate)}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-zinc-500 font-medium">Tornou-se Membro</p>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <CalendarIcon className="w-4 h-4 text-zinc-500" />
                {formatDateLabel(selectedPerson?.membershipDate)}
              </div>
            </div>
            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-zinc-500 font-medium">Endereço</p>
              <div className="flex items-start gap-2 text-sm text-zinc-300">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <span>{selectedPerson?.address || "Não informado"}</span>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-xs text-zinc-500 font-medium">Anotações e Histórico Rápido</p>
              <div className="text-sm text-zinc-400 bg-zinc-900/50 border border-zinc-800/80 rounded-md p-3 min-h-[80px] whitespace-pre-wrap">
                {selectedPerson?.notes || "Nenhuma anotação extra foi adicionada para este perfil."}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} variant="outline" className="border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300">
              Cerrar visualização
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
         <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold text-red-500">Excluir Registro</DialogTitle>
            <DialogDescription className="text-zinc-400 mt-2">
              Esta ação é permanente e você não poderá recuperar o perfil de <strong className="text-zinc-100">{selectedPerson?.name}</strong>. Deseja continuar?
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
              <Button onClick={handleDeletePerson} disabled={isSubmitting} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 font-semibold transition-colors">
                {isSubmitting ? "Excluindo..." : "Excluir permanentemente"}
              </Button>
          </DialogFooter>
         </DialogContent>
      </Dialog>
      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="glass border-zinc-800 text-zinc-100 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-display font-bold">Alterar Status</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Selecione o novo status para <strong className="text-zinc-100">{selectedPerson?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <Select 
              value={selectedPerson?.status} 
              onValueChange={async (val) => {
                await handleStatusChange(selectedPerson.id, val);
                setIsStatusDialogOpen(false);
              }}
            >
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
          <DialogFooter>
            <Button onClick={() => setIsStatusDialogOpen(false)} variant="ghost" className="text-zinc-400 hover:text-zinc-100">
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
