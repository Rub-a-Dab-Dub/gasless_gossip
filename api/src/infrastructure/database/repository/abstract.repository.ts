import { Logger, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { AbstractEntity } from '../entity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly itemsRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  async createMany(entity: T[]): Promise<T[]> {
    return this.entityManager.save(entity);
  }

  async findOne(
    where: FindOptionsWhere<T>,
    relations?: FindOptionsRelations<T>,
    order?: FindOptionsOrder<T>,
  ): Promise<T | null> {
    const entity = await this.itemsRepository.findOne({
      where,
      relations,
      order,
    });
    // if (!entity) {
    //   console.log('warning', 'nnoot f');
    //   this.logger.warn('Document not found with where', where);
    //   throw new NotFoundException('Entity not found.');
    // }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const updateResult = await this.itemsRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn('Entity not found with where', where);
      throw new NotFoundException('Entity not found.');
    }

    return this.findOne(where);
  }

  async update(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ) {
    const result = await this.itemsRepository.update(where, partialEntity);
    return result;
  }

  async find(where: FindOptionsWhere<T>) {
    return this.itemsRepository.findBy(where);
  }

  async findWithRelationship(options: FindManyOptions<T>) {
    return this.itemsRepository.find(options);
  }

  async findOneAndDelete(where: FindOptionsWhere<T>) {
    await this.itemsRepository.delete(where);
  }

  async remove(entities: T[]) {
    await this.itemsRepository.remove(entities);
  }

  // async getQueryBuilder() {
  //   return this.itemsRepository.createQueryBuilder;
  // }
}
