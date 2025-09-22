import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class VoteDto {
  @IsUUID()
  pollId!: string;

  @IsInt()
  @Min(0)
  optionIndex!: number;
}


