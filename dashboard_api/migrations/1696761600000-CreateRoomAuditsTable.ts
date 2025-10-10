import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateRoomAuditsTable1696761600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'room_audits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'roomId',
            type: 'uuid',
          },
          {
            name: 'creatorId',
            type: 'uuid',
          },
          {
            name: 'action',
            type: 'enum',
            enum: ['created', 'updated', 'deleted', 'suspended', 'expired'],
          },
          {
            name: 'metadata',
            type: 'jsonb',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'isAnomalous',
            type: 'boolean',
            default: false,
          },
          {
            name: 'anomalyScore',
            type: 'float',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['roomId'],
            referencedTableName: 'rooms',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true
    );

    // Create indexes
    await queryRunner.createIndex(
      'room_audits',
      new TableIndex({
        name: 'IDX_ROOM_AUDITS_ROOM_ID',
        columnNames: ['roomId'],
      })
    );

    await queryRunner.createIndex(
      'room_audits',
      new TableIndex({
        name: 'IDX_ROOM_AUDITS_CREATOR_ID',
        columnNames: ['creatorId'],
      })
    );

    await queryRunner.createIndex(
      'room_audits',
      new TableIndex({
        name: 'IDX_ROOM_AUDITS_CREATED_AT',
        columnNames: ['createdAt'],
      })
    );

    await queryRunner.createIndex(
      'room_audits',
      new TableIndex({
        name: 'IDX_ROOM_AUDITS_DESCRIPTION_FULLTEXT',
        columnNames: ['description'],
        isFulltext: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('room_audits', true);
  }
}