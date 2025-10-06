"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async;
create(createQuestDto, CreateQuestDto);
Promise < Quest > {
    const: quest = this.questRepository.create(createQuestDto),
    return: await this.questRepository.save(quest)
};
async;
findAll(status ?  : QuestStatus);
Promise < Quest[] > {
    const: where = status ? { status } : {},
    return: await this.questRepository.find({
        where,
        relations: ['userProgress']
    })
};
async;
findOne(id, string);
Promise < Quest > {
    const: quest = await this.questRepository.findOne({
        where: { id },
        relations: ['userProgress']
    }),
    if(, quest) {
        throw new NotFoundException(`Quest with ID ${id} not found`);
    },
    return: quest
};
async;
update(id, string, updateQuestDto, UpdateQuestDto);
Promise < Quest > {
    const: quest = await this.findOne(id),
    if(quest) { }, : .status === QuestStatus.ACTIVE
};
{
    const hasProgress = await this.progressRepository.count({
        where: { questId: id, currentProgress: MoreThan(0) }
    });
    if (hasProgress > 0 && (updateQuestDto.targetCount || updateQuestDto.taskType)) {
        throw new BadRequestException('Cannot change target or task type for quests with active progress');
    }
}
Object.assign(quest, updateQuestDto);
return await this.questRepository.save(quest);
async;
delete (id);
string;
Promise < void  > {
    const: quest = await this.findOne(id),
    quest, : .status = QuestStatus.ENDED,
    quest, : .endsAt = new Date(),
    await, this: .questRepository.save(quest)
};
//# sourceMappingURL=crud.js.map