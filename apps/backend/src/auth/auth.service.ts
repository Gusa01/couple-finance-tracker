import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds an existing user by their Supabase UUID or creates one on first login.
   * The `id` is the Supabase Auth user UUID (`sub` from JWT).
   */
  async validateOrCreateUser(supabaseId: string, email: string): Promise<User> {
    return this.prisma.user.upsert({
      where: { id: supabaseId },
      update: {},
      create: {
        id: supabaseId,
        email,
        name: email.split('@')[0],
      },
    });
  }
}
