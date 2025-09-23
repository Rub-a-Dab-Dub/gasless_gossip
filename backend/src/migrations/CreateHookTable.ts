import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateHookTable1698000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'hooks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'gen_random_uuid()',
          },
          {
            name: 'eventType',
            type: 'enum',
            enum: ['xp_update', 'token_send', 'token_receive', 'contract_call', 'account_created'],
            isNullable: false,
          },
          {
            name: 'data',
            type: 'jsonb',
            isNullable: false,
          },
          {
            name: 'stellarTransactionId',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'stellarAccountId',
            type: 'varchar',
            length: '56',
            isNullable: true,
          },
          {
            name: 'processed',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'processedAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'errorMessage',
            type: 'text',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes for better query performance
    await queryRunner.createIndex(
      'hooks',
      new Index({
        name: 'IDX_HOOKS_EVENT_TYPE_CREATED_AT',
        columnNames: ['eventType', 'createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'hooks',
      new Index({
        name: 'IDX_HOOKS_STELLAR_TRANSACTION_ID',
        columnNames: ['stellarTransactionId'],
      }),
    );

    await queryRunner.createIndex(
      'hooks',
      new Index({
        name: 'IDX_HOOKS_PROCESSED',
        columnNames: ['processed'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('hooks');
  }
}