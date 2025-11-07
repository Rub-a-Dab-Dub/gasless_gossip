import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1762546904557 implements MigrationInterface {
    name = 'Migrations1762546904557'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_verification" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "user_id" integer NOT NULL, "retry_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expires_at" TIMESTAMP NOT NULL, "type" character varying NOT NULL DEFAULT 'verify-email', "is_used" boolean NOT NULL DEFAULT false, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_679edeb6fcfcbc4c094573e27e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_verification" ADD CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_verification" DROP CONSTRAINT "FK_3d40c1993bffba775f0ffad0cae"`);
        await queryRunner.query(`DROP TABLE "user_verification"`);
    }

}
