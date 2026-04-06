import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from '../prisma/prisma.service';
import { ExpensesService } from '../expenses/expenses.service';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const BUCKET = 'receipts';

@Injectable()
export class ReceiptsService {
  private readonly supabase: SupabaseClient;

  constructor(
    private readonly prisma: PrismaService,
    private readonly expensesService: ExpensesService,
    config: ConfigService,
  ) {
    this.supabase = createClient(
      config.getOrThrow('SUPABASE_URL'),
      config.getOrThrow('SUPABASE_SERVICE_KEY'),
    );
  }

  async uploadReceipt(expenseId: string, userId: string, file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de archivo no soportado. Permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('El archivo no puede superar los 5MB');
    }

    // Verifica que el gasto existe y pertenece al usuario
    await this.expensesService.findOne(expenseId, userId);

    const ext = file.originalname.split('.').pop() ?? 'jpg';
    const path = `${expenseId}/${Date.now()}.${ext}`;

    const { error } = await this.supabase.storage
      .from(BUCKET)
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: false });

    if (error) {
      throw new InternalServerErrorException(`Error al subir el archivo: ${error.message}`);
    }

    const { data } = this.supabase.storage.from(BUCKET).getPublicUrl(path);

    return this.prisma.receipt.create({
      data: { expenseId, fileUrl: data.publicUrl },
    });
  }
}
