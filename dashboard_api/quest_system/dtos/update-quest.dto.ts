import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateQuestDto } from './create-quest.dto';
import { QuestStatus } from '../entities/quest.entity';

export class UpdateQuestDto extends PartialType(CreateQuestDto) {
  @IsEnum(QuestStatus)
  @IsOptional()
  status?: QuestStatus;
}

// progress-quest.dto.ts
import { IsInt, Min } from 'class-validator';

export class ProgressQuestDto {
  @IsInt()
  @Min(1)
  increment: number;
}