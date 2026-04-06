import { IsHexColor, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name!: string;

  @IsHexColor()
  color!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  icon!: string;
}
