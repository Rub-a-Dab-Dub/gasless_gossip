"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReactionsTable1234567890 = void 0;
const typeorm_1 = require("typeorm");
class CreateReactionsTable1234567890 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
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
        }), true);
        await queryRunner.createIndex('reactions', new typeorm_1.Index('IDX_REACTION_USER_MESSAGE', ['messageId', 'userId'], {
            isUnique: true,
        }));
        await queryRunner.createIndex('reactions', new typeorm_1.Index('IDX_REACTION_MESSAGE', ['messageId']));
        await queryRunner.createIndex('reactions', new typeorm_1.Index('IDX_REACTION_USER', ['userId']));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('reactions');
    }
}
exports.CreateReactionsTable1234567890 = CreateReactionsTable1234567890;
//# sourceMappingURL=XXXXXX-create-reactions-table.js.map