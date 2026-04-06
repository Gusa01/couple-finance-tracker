export interface JoinCoupleDto {
  inviteCode: string;
}

export interface InviteResponseDto {
  inviteCode: string;
}

export interface CoupleResponseDto {
  id: string;
  inviteCode: string;
  partner: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  createdAt: string;
}
