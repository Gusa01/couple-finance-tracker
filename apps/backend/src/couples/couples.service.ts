import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Couple, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from '../categories/categories.service';
import { JoinCoupleDto } from './dto/join-couple.dto';

@Injectable()
export class CouplesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
  ) {}

  async createInvite(user: User): Promise<{ inviteCode: string }> {
    const existing = await this.findCoupleByUser(user.id);
    if (existing) {
      throw new BadRequestException('Ya tenés una pareja activa');
    }

    const inviteCode = this.generateInviteCode(user.id);
    return { inviteCode };
  }

  async joinCouple(currentUser: User, dto: JoinCoupleDto): Promise<Couple> {
    const { inviteCode } = dto;

    const inviterId = this.decodeInviteCode(inviteCode);
    if (!inviterId) {
      throw new BadRequestException('Código de invitación inválido');
    }

    if (inviterId === currentUser.id) {
      throw new BadRequestException('No podés unirte a tu propia invitación');
    }

    const inviter = await this.prisma.user.findUnique({ where: { id: inviterId } });
    if (!inviter) {
      throw new NotFoundException('El usuario que generó la invitación no existe');
    }

    const inviterHasCouple = await this.findCoupleByUser(inviterId);
    if (inviterHasCouple) {
      throw new BadRequestException('Este código ya fue usado');
    }

    const currentUserHasCouple = await this.findCoupleByUser(currentUser.id);
    if (currentUserHasCouple) {
      throw new BadRequestException('Ya tenés una pareja activa');
    }

    const couple = await this.prisma.couple.create({
      data: {
        user1Id: inviterId,
        user2Id: currentUser.id,
        inviteCode,
      },
      include: { user1: true, user2: true },
    });

    // Seed de categorías por defecto para la nueva pareja
    await this.categoriesService.seedDefaults(couple.id);

    return couple;
  }

  async getMyCouple(userId: string): Promise<Couple & { user1: User; user2: User }> {
    const couple = await this.findCoupleByUser(userId);
    if (!couple) {
      throw new NotFoundException('No tenés una pareja activa');
    }
    return couple as Couple & { user1: User; user2: User };
  }

  private async findCoupleByUser(userId: string) {
    return this.prisma.couple.findFirst({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: { user1: true, user2: true },
    });
  }

  private generateInviteCode(userId: string): string {
    return Buffer.from(userId).toString('base64url');
  }

  private decodeInviteCode(code: string): string | null {
    try {
      return Buffer.from(code, 'base64url').toString('utf-8');
    } catch {
      return null;
    }
  }
}
