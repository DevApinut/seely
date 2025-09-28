import request from 'supertest';
import { setupTestApp, TestSetup } from '../utils/test-setup';

describe('JWT Authentication (e2e)', () => {
  const getApp = setupTestApp();

  //
  //------------------------- User route-------------------------------
  //
  describe('User route', () => {
    //
    // Set up data for user login
    //
    const Createdata = {
      username: 'apinuttest',
      password: '1234',
      role: 'USER',
    };
    const logindata_wrong_data = {
      username: 'apinuttest',
      password: '1234',
      role: 'user',
    };

    it('/users Should be create user success', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/users')
        .send(Createdata)
        .expect(201);

      // Specific checks
      expect(response.body.username).toBe(Createdata.username);
      expect(response.body.role).toBe('USER');
      expect(response.body.password).toMatch(/^\$2b\$/);
      expect(response.body.keycloakId).toBeNull();

      //   --------delete user after test------------------
      await TestSetup.deleteUserByUsername(getApp(), Createdata.username);
    });
    it('/users Should wrong validate', async () => {
      const response = await request(getApp().getHttpServer())
        .post('/users')
        .send(logindata_wrong_data)
        .expect(400);

      // Specific checks
      expect(response.body).toHaveProperty('errors');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('statusCode', 400);
    });
  });
  //
  //------------------------- Authentication Tests-------------------------------
  //
  describe('/users/me for check access token', () => {
    const loginData = {
      username: 'apinut',
      password: '1234',
      role: 'USER',
    };

    it('/users/me Should get current user info with token', async () => {
      // Create user and get token
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify response contains user information
      expect(response.body).toBeDefined();
      expect(response.body.username).toBe(loginData.username);
      expect(response.body.role).toBe('USER');
      // Password should not be returned in the response
      expect(response.body.password).toBeUndefined();
    });

    it('/users/me Should return 401 without token', async () => {
      // Try to access /users/me without token
      await request(getApp().getHttpServer()).get('/users/me').expect(401);
    });

    it('/users/me Should return 401 with invalid token', async () => {
      // Try to access /users/me with invalid token
      await request(getApp().getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid_token_here')
        .expect(401);
    });
  });
});
