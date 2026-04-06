import { IsNotEmpty, IsString, Length } from 'class-validator';

export class JoinCoupleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  inviteCode!: string;
}
