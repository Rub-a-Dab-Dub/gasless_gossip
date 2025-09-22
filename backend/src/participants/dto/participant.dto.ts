import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class JoinParticipantDto {
  @IsNotEmpty()
  @IsString()
  roomId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  pseudonym!: string;
}

export class LeaveParticipantDto {
  @IsNotEmpty()
  @IsString()
  roomId!: string;
}
