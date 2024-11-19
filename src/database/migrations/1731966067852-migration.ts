import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1731966067852 implements MigrationInterface {
    name = 'Migration1731966067852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "UQ_ae9cc28fa716b66a5288c86a941"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "UQ_4242fa6124eb2d756c378e17dd1" UNIQUE ("user_id", "city")`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f"`);
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "UQ_4242fa6124eb2d756c378e17dd1"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_ba3b695bc9d4bd35cc12839507f" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "UQ_ae9cc28fa716b66a5288c86a941" UNIQUE ("city")`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "location" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`);
    }

}
