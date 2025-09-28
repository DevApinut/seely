import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';

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

  // Delete specific user by username (using direct database query)
  static async deleteUserByUsername(
    app: INestApplication,
    username: string
  ): Promise<void> {
    try {
      const dataSource = app.get(DataSource);
      
      // Delete user by username from 'users' table
      await dataSource.query('DELETE FROM "users" WHERE username = $1', [username]);
      
      console.log(`User ${username} deleted successfully`);
    } catch (error) {
      console.log(`Failed to delete user ${username}:`, error.message);
    }
  }
}

export const setupTestApp = () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await TestSetup.createTestApp();
  });

  afterEach(async () => {
    // Optional: Clean database after each test as well
    // await TestSetup.cleanDatabase(app);
    await TestSetup.closeTestApp(app);
  });

  return () => app; // Return getter function
};