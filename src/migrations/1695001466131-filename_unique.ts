import { MigrationInterface, QueryRunner } from "typeorm";

export class FilenameUnique1695001466131 implements MigrationInterface {
    name = 'FilenameUnique1695001466131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` ADD UNIQUE INDEX \`IDX_df16ff3255e6dfc777b086949b\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`file\` DROP INDEX \`IDX_df16ff3255e6dfc777b086949b\``);
    }

}
