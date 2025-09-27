import { MigrationInterface, QueryRunner } from "typeorm";

export class InitRating1758952363821 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Insert initial rating data
        await queryRunner.query(`
            INSERT INTO "ratings" ("name", "description") VALUES 
            ('ส สงเสริม', 'ภาพยนตร์ที่ส่งเสริมการเรียนรู้และควรส่งเสริมให้มีการดู'),
            ('ท ทั่วไป', 'ภาพยนตร์ที่เหมาะสมกับผู้ดูทั่วไป'),
            ('น 13+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 13 ปีขึ้นไป'),
            ('น 15+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 15 ปีขึ้นไป'),
            ('น 18+', 'ภาพยนตร์ที่เหมาะสมกับผู้มีอายุตั้งแต่ 18 ปีขึ้นไป'),
            ('ฉ 20+', 'ภาพยนตร์เรื่องนี้ ห้ามผู้มีอายุตำ่ากว่า 20 ปีดู (ตรวจบัตรประชาชน)')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove initial rating data
        await queryRunner.query(`
            DELETE FROM "ratings" WHERE "name" IN 
            ('ส สงเสริม', 'ท ทั่วไป', 'น 13+', 'น 15+', 'น 18+', 'ฉ 20+')
        `);
    }

}
