import { IsArray, IsOptional, IsString } from 'class-validator';

export class SettleBalanceDto {
  /** Si no se pasa, se saldan todos los splits pendientes de la pareja */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  splitIds?: string[];
}
