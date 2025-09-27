import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSuggest1758953904087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert initial suggests data (15 examples)
        await queryRunner.query(`
            INSERT INTO "suggest" ("series_id", "score", "username") VALUES
            (1, 9, 'apinut'),
            (1, 8, 'john'),
            (2, 10, 'kaewmunee'),
            (5, 7, 'donut'),
            (4, 9, 'apinut555@gmail.com'),
            (2, 10, 'wer987654321@hotmail.com'),
            (2, 9, 'apinut'),
            (6, 8, 'john'),
            (4, 9, 'kaewmunee'),
            (6, 8, 'donut'),
            (6, 10, 'apinut555@gmail.com'),
            (5, 9, 'wer987654321@hotmail.com'),
            (3, 8, 'apinut'),
            (7, 7, 'john'),
            (6, 9, 'kaewmunee');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove all initial suggests data
        await queryRunner.query(`
            DELETE FROM "suggest" WHERE "series_id" IN (1, 2, 3, 4, 5, 6, 7);
        `);
    }

}
