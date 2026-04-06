import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { DEFAULT_CATEGORIES } from '@cft/shared';
import { PrismaService } from '../prisma/prisma.service';
import { CouplesService } from '../couples/couples.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly couplesService: CouplesService,
  ) {}

  async findAll(userId: string) {
    const couple = await this.couplesService.getMyCouple(userId);
    return this.prisma.category.findMany({
      where: { coupleId: couple.id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
    const couple = await this.couplesService.getMyCouple(userId);
    return this.prisma.category.create({
      data: { ...dto, coupleId: couple.id },
    });
  }

  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    await this.assertOwnership(id, userId);
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.assertOwnership(id, userId);

    const hasExpenses = await this.prisma.expense.count({ where: { categoryId: id } });
    if (hasExpenses > 0) {
      throw new BadRequestException(
        'No podés eliminar una categoría que tiene gastos asociados',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { deleted: true };
  }

  /** Seed de categorías por defecto. Llamado al crear un Couple. */
  async seedDefaults(coupleId: string) {
    await this.prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((c) => ({ ...c, coupleId })),
      skipDuplicates: true,
    });
  }

  private async assertOwnership(categoryId: string, userId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
      include: { couple: true },
    });

    if (!category) throw new NotFoundException('Categoría no encontrada');

    const isCoupleMember =
      category.couple.user1Id === userId || category.couple.user2Id === userId;

    if (!isCoupleMember) {
      throw new ForbiddenException('No tenés acceso a esta categoría');
    }
  }
}
