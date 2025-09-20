import { ApiProperty } from "@nestjs/swagger";
import { ReactionType } from "../entities/reaction.entity";

export class ReactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  messageId: string;

  @ApiProperty({ enum: ReactionType })
  type: ReactionType;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}

export class ReactionCountDto {
  @ApiProperty()
  messageId: string;

  @ApiProperty()
  totalCount: number;

  @ApiProperty({
    description: "Count by reaction type",
    example: { like: 5, love: 2, laugh: 1 },
  })
  countByType: Record<ReactionType, number>;
}
