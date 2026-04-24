import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Person, PersonStatus } from '@prisma/client';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PeopleService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePersonDto): Promise<Person> {
    const { birthDate, ...rest } = data;
    const person = await this.prisma.person.create({
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
    });

    // Record initial status in history
    await this.prisma.history.create({
      data: {
        personId: person.id,
        action: 'CREATED',
        details: `Cadastro inicial com status ${person.status}`,
      },
    });

    return person;
  }

  async findAll() {
    return this.prisma.person.findMany({
      include: {
        _count: {
          select: { History: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const person = await this.prisma.person.findUnique({
      where: { id },
      include: { History: { orderBy: { createdAt: 'desc' } } },
    });

    if (!person) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }

    return person;
  }

  async updateStatus(id: string, newStatus: PersonStatus, details?: string) {
    const person = await this.prisma.person.findUnique({ where: { id } });
    if (!person) throw new NotFoundException('Pessoa não encontrada');

    const updatedPerson = await this.prisma.person.update({
      where: { id },
      data: { status: newStatus },
    });

    await this.prisma.history.create({
      data: {
        personId: id,
        action: 'STATUS_CHANGE',
        details: `Status alterado de ${person.status} para ${newStatus}. ${details || ''}`,
      },
    });

    return updatedPerson;
  }

  async update(id: string, data: UpdatePersonDto) {
    const { birthDate, ...rest } = data;
    return this.prisma.person.update({
      where: { id },
      data: {
        ...rest,
        birthDate: birthDate ? new Date(birthDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.person.delete({ where: { id } });
  }
}
