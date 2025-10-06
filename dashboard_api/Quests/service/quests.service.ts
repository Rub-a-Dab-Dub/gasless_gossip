import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QuestsService {
  constructor(
    @InjectRepository(Quest)
    private questRepository: Repository<Quest>,
    @InjectRepository(UserQuestProgress)
    private progressRepository: Repository<UserQuestProgress>,
    @InjectRepository(QuestCompletionAudit)
    private auditRepository: Repository<QuestCompletionAudit>,
    @InjectRepository(FrenzyEvent)
    private frenzyRepository: Repository<FrenzyEvent>,
  ) {}