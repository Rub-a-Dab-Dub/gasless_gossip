export class UpdateQuestDto extends PartialType(CreateQuestDto) {
  @IsEnum(QuestStatus)
  @IsOptional()
  status?: QuestStatus;
}
