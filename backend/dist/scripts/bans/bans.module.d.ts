export declare class BansModule {
}
import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateBansReportsTables1234567890123 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
