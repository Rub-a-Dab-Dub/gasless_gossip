import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762556176290 implements MigrationInterface {
    name = 'Migrations1762556176290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_verification" DROP COLUMN "retry_count"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_verification" ADD "retry_count" integer NOT NULL DEFAULT '0'`);
    }

}
