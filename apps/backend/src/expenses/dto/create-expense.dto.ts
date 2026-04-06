import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { SplitType } from '@prisma/client';

class CustomSplitDto {
  @IsNumber()
  @Min(1)
  @Max(99)
  user1Percentage!: number;

  @IsNumber()
  @Min(1)
  @Max(99)
  user2Percentage!: number;
}

export class CreateExpenseDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsUUID()
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsDateString()
  date!: string;

  @IsEnum(SplitType)
  splitType!: SplitType;

  @ValidateIf((o) => o.splitType === SplitType.CUSTOM)
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomSplitDto)
  customSplit?: CustomSplitDto;
}
