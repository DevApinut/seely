import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUser1758953112619 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert initial users data
        await queryRunner.query(`
            INSERT INTO "users" ("username", "password", "role", "keycloak_id") VALUES
            ('apinut', '$2b$10$xlyzjURC7TUYVFWOYj0Kbu.9NFzwIDJTq3fuur1Yw4.TVZUNn1gi.', 'USER', NULL),
            ('john', '$2b$10$/uHUZqEZx4DLK5K985F.i.bx74Vi9GUHhLLQamFPJhjKufFjNhVX2', 'USER', NULL),
            ('kaewmunee', '$2b$10$gbAQROjEVcyBfr7k1753Au5MQvacyAZgylFRWP0Iq24wDMjd3S4gW', 'USER', NULL),
            ('donut', '$2b$10$sJlTZg6kii2ZsbODgAazyeGsEjYkzyK8j4UH8dqPTadJIYjMiukGO', 'USER', NULL),
            ('apinut555@gmail.com', NULL, 'USER', '392de118-0c0c-40e4-a628-9b77b1354c42'),
            ('wer987654321@hotmail.com', NULL, 'USER', '3c632971-d475-4d23-adeb-06b9a18131b8');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove initial users data
        await queryRunner.query(`
            DELETE FROM "users" WHERE "username" IN (
                'apinut', 
                'john', 
                'kaewmunee', 
                'donut', 
                'apinut555@gmail.com', 
                'wer987654321@hotmail.com'
            );
        `);
    }

}
