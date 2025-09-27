import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSeries1758953517427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert initial series data
        await queryRunner.query(`
            INSERT INTO "series" ("name", "year", "review", "image_url", "rating_id", "username") VALUES
            ('Stranger Things', 2016, 'A nostalgic sci-fi horror series that perfectly captures 80s nostalgia while delivering compelling supernatural mysteries and strong character development.', 'https://example.com/images/stranger-things.jpg', 3, 'apinut'),
            ('Game of Thrones', 2011, 'Epic fantasy drama with complex political intrigue, memorable characters, and stunning production values, though later seasons were divisive.', 'https://example.com/images/game-of-thrones.jpg', 4, 'apinut555@gmail.com'),
            ('The Office', 2005, 'Hilarious mockumentary-style comedy about office life with perfect character chemistry and quotable moments that remain timeless.', 'https://example.com/images/the-office.jpg', 6, 'apinut555@gmail.com'),
            ('Attack on Titan', 2013, 'Dark and intense anime with incredible world-building, complex themes about freedom and humanity, and jaw-dropping plot twists.', 'https://example.com/images/attack-on-titan.jpg', 4, 'apinut555@gmail.com'),
            ('Breaking Bad', 2008, 'Masterful character study of moral decay with exceptional writing, acting, and cinematography that creates television history.', 'https://example.com/images/breaking-bad.jpg', 2, 'donut'),
            ('The Empress of Ayodhaya', 2022, 'ซีรีส์ไทยที่มีเนื้อเรื่องเข้มข้น เล่าเรื่องราวทางประวัติศาสตร์ที่น่าสนใจ พร้อมการแสดงที่ประทับใจ', 'https://example.com/images/empress-ayodhaya.jpg', 1, 'wer987654321@hotmail.com'),
            ('Our Planet', 2019, 'Breathtaking nature documentary series with stunning cinematography that showcases the beauty and fragility of our natural world.', 'https://example.com/images/our-planet.jpg', 3, 'john');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove initial series data
        await queryRunner.query(`
            DELETE FROM "series" WHERE "name" IN (
                'Stranger Things',
                'Game of Thrones',
                'The Office',
                'Attack on Titan',
                'Breaking Bad',
                'The Empress of Ayodhaya',
                'Our Planet'
            );
        `);
    }

}
