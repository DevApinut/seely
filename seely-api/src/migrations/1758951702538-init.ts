import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1758951702538 implements MigrationInterface {
    name = 'Init1758951702538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying, "role" character varying NOT NULL DEFAULT 'USER', "keycloak_id" character varying, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97b5061278a40c1dead71c1b889" UNIQUE ("keycloak_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ratings" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "series" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "year" integer NOT NULL, "review" character varying NOT NULL DEFAULT '', "image_url" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "rating_id" integer, "username" character varying, CONSTRAINT "PK_e725676647382eb54540d7128ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "suggest" ("id" SERIAL NOT NULL, "series_id" integer NOT NULL, "score" integer NOT NULL, "username" character varying, CONSTRAINT "PK_ac148ab93e509e6cc93336cfa0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "series" ADD CONSTRAINT "FK_a9ab8ed1ac37113a178025f6254" FOREIGN KEY ("rating_id") REFERENCES "ratings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "series" ADD CONSTRAINT "FK_048a1e1cb9c941faf74b8396c6b" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggest" ADD CONSTRAINT "FK_75cffc7ece6c817a3d53d3870ac" FOREIGN KEY ("series_id") REFERENCES "series"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "suggest" ADD CONSTRAINT "FK_36f8a2e98c031c58db17b466be5" FOREIGN KEY ("username") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "suggest" DROP CONSTRAINT "FK_36f8a2e98c031c58db17b466be5"`);
        await queryRunner.query(`ALTER TABLE "suggest" DROP CONSTRAINT "FK_75cffc7ece6c817a3d53d3870ac"`);
        await queryRunner.query(`ALTER TABLE "series" DROP CONSTRAINT "FK_048a1e1cb9c941faf74b8396c6b"`);
        await queryRunner.query(`ALTER TABLE "series" DROP CONSTRAINT "FK_a9ab8ed1ac37113a178025f6254"`);
        await queryRunner.query(`DROP TABLE "suggest"`);
        await queryRunner.query(`DROP TABLE "series"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
