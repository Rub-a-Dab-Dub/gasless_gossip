"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHookTable1698000000000 = void 0;
const typeorm_1 = require("typeorm");
class CreateHookTable1698000000000 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createIndex('hooks', new typeorm_1.Index({
            name: 'IDX_HOOKS_EVENT_TYPE_CREATED_AT',
            columnNames: ['eventType', 'createdAt'],
        }));
        await queryRunner.createIndex('hooks', new typeorm_1.Index({
            name: 'IDX_HOOKS_STELLAR_TRANSACTION_ID',
            columnNames: ['stellarTransactionId'],
        }));
        await queryRunner.createIndex('hooks', new typeorm_1.Index({
            name: 'IDX_HOOKS_PROCESSED',
            columnNames: ['processed'],
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('hooks');
    }
}
exports.CreateHookTable1698000000000 = CreateHookTable1698000000000;
//# sourceMappingURL=CreateHookTable.js.map