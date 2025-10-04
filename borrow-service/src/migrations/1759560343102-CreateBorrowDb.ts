import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBorrowDb1759560343102 implements MigrationInterface {
    name = 'CreateBorrowDb1759560343102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`borrow\` (\`id\` varchar(36) NOT NULL, \`userId\` varchar(255) NOT NULL, \`bookId\` varchar(255) NOT NULL, \`borrowDate\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`borrow\``);
    }

}
