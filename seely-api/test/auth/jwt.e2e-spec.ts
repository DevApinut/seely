
import request from 'supertest';
import { setupTestApp } from '../utils/test-setup';

describe('JWT Authentication (e2e)', () => {
  const getApp = setupTestApp();

  //
  //------------------------- Authentication Test JWT Login-------------------------------
  //
  describe('Authentication JWT', () => {
    //
    // Set up data for JWT test
    //
    const loginData = {
      username: 'apinut',
      password: '1234',
    };

    //
    // For test login recieve accesstoken (201)
    //
    it('/auth/login Should be login success', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(201);
      //
      // Check if response has accessToken
      //
      expect(response.body).toHaveProperty('accessToken');
      //
      // Check cookies
      //
      expect(response.headers['set-cookie']).toBeDefined();
      //
      // Check refresh token in cookie
      //
      const setCookie = response.headers['set-cookie'];
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.includes('accessToken='),
      );
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.includes('refreshToken='),
      );
      expect(accessTokenCookie).toBeDefined();
      expect(accessTokenCookie).toMatch(/accessToken=[\w.-]+/);
      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toMatch(/refreshToken=[\w.-]+/);
    });

    it('/auth/login wrong password', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/auth/login')
        .send({
          username: 'apinut',
          password: '12345',
        })
        .expect(401);

      //
      // Error wrong password (401) Error
      //
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 401);
      //
      // Should not recieve accessToken
      //
      expect(response.body).not.toHaveProperty('accessToken');
      //
      // Should not set cookie
      //
      expect(response.headers['set-cookie']).toBeUndefined();
    });

    //
    // Don't have username on database Internal ERROR 500
    //
    it('/auth/login wrong username', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/auth/login')
        .send({
          username: 'Donut',
          password: '1234',
        })
        .expect(500);

      //
      // Error wrong password
      //
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 500);
      expect(response.body.message).toContain('Internal server error');
      //
      // Should not recieve accessToken
      //
      expect(response.body).not.toHaveProperty('accessToken');
      //
      // Should not set cookie
      //
      expect(response.headers['set-cookie']).toBeUndefined();
    });
  });
  
  //
  //--------------------------- Authentication Test JWT Logout-------------------------------
  //
  describe('Logout JWT', () => {
    //
    // For test logout
    //
    it('/auth/logout Should be clear cookie', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/auth/logout') // Changed from '/auth/out' to '/auth/logout'
        .expect(201); // Usually logout returns 200

      //
      // Check refresh token in cookie
      //
      const setCookie = response.headers['set-cookie'];
      const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];

      const accessTokenCookie = cookies.find((cookie) =>
        cookie.includes('accessToken='),
      );
      const refreshTokenCookie = cookies.find((cookie) =>
        cookie.includes('refreshToken='),
      );

      // Check cookies remove
      if (accessTokenCookie) {
        expect(accessTokenCookie).toMatch(
          /(accessToken=;|accessToken="")/,
        );
      }
      if (refreshTokenCookie) {
        expect(refreshTokenCookie).toMatch(
          /(refreshToken=;|refreshToken="")/,
        );
      }
    });
  });
});