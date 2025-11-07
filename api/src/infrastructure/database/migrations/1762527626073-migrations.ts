import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762527626073 implements MigrationInterface {
    name = 'Migrations1762527626073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "is_verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "is_verified"`);
    }

}
