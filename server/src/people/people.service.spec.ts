import { Test, TestingModule } from '@nestjs/testing';
import { PeopleService } from './people.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { PersonStatus } from '@prisma/client';

describe('PeopleService', () => {
  let service: PeopleService;
  let prisma: PrismaService;

  const mockPrismaService = {
    person: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    history: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeopleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PeopleService>(PeopleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a person and record history', async () => {
      const dto = { name: 'João Silva', email: 'joao@example.com', status: PersonStatus.VISITOR };
      const expectedPerson = { id: '1', ...dto };

      mockPrismaService.person.create.mockResolvedValue(expectedPerson);

      const result = await service.create(dto as any);

      expect(result).toEqual(expectedPerson);
      expect(prisma.person.create).toHaveBeenCalledWith({ data: dto });
      expect(prisma.history.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a person if found', async () => {
      const person = { id: '1', name: 'João' };
      mockPrismaService.person.findUnique.mockResolvedValue(person);

      const result = await service.findOne('1');

      expect(result).toEqual(person);
    });

    it('should throw NotFoundException if person not found', async () => {
      mockPrismaService.person.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update status and record history', async () => {
      const person = { id: '1', status: PersonStatus.VISITOR };
      const updatedPerson = { id: '1', status: PersonStatus.MEMBER };

      mockPrismaService.person.findUnique.mockResolvedValue(person);
      mockPrismaService.person.update.mockResolvedValue(updatedPerson);

      const result = await service.updateStatus('1', PersonStatus.MEMBER);

      expect(result.status).toBe(PersonStatus.MEMBER);
      expect(prisma.person.update).toHaveBeenCalled();
      expect(prisma.history.create).toHaveBeenCalled();
    });
  });
});
