import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';

export class TestSetup {
  static async createTestApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();
    return app;
  }

  static async closeTestApp(app: INestApplication): Promise<void> {
    await app.close();
  }
}

export const setupTestApp = () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await TestSetup.createTestApp();
  });

  afterEach(async () => {
    await TestSetup.closeTestApp(app);
  });

  return () => app; // Return getter function
};