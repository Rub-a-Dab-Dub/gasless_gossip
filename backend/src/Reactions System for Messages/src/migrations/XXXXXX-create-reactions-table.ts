import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateReactionsTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reactions',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'messageId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['like', 'love', 'laugh', 'wow', 'sad', 'angry'],
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique constraint
    await queryRunner.createIndex(
      'reactions',
      new Index('IDX_REACTION_USER_MESSAGE', ['messageId', 'userId'], {
        isUnique: true,
      }),
    );

    // Create performance indexes
    await queryRunner.createIndex(
      'reactions',
      new Index('IDX_REACTION_MESSAGE', ['messageId']),
    );
    await queryRunner.createIndex(
      'reactions',
      new Index('IDX_REACTION_USER', ['userId']),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('reactions');
  }
}
