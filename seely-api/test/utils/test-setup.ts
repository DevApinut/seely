import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import request from 'supertest';

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

  // Helper function to login and get tokens
  static async loginAndGetTokens(
    app: INestApplication,
    loginData: { username: string ; password: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginData)
      .expect(201);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
    };
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