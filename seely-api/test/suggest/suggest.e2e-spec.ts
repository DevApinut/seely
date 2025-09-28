import request from 'supertest';
import { setupTestApp, TestSetup } from '../utils/test-setup';

describe('serires e2e test', () => {
  const getApp = setupTestApp();

  const loginData = {
    username: 'apinut',
    password: '1234',
    role: 'USER',
  };

  const suggestExample = {
    series_id: 6,
    score: 5,
  };
  const suggestUpdateExample = {    
    score: 8,
  };
  let createdSuggest: number;

  it('/series Should create series and success', async () => {
    // Use token to get current user info
    const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
      getApp(),
      loginData,
    );
    const response = await request(getApp().getHttpServer())
      .post(`/suggest`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(suggestExample)
      .expect(201);
    createdSuggest = response.body.id
    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined(); // ตรวจสอบว่ามี id
    expect(response.body.series_id).toBe(suggestExample.series_id);
    expect(response.body.score).toBe(suggestExample.score);
  });

  it('/series Should update series and success', async () => {
    // Use token to get current user info
    const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
      getApp(),
      loginData,
    );
    const response = await request(getApp().getHttpServer())
      .patch(`/suggest/${suggestExample.series_id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(suggestUpdateExample)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();    
    expect(response.body.score).toBe(suggestUpdateExample.score);
  });
  
  it('/series Should delete series and success', async () => {
    // Use token to get current user info
    const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
      getApp(),
      loginData,
    );
    const response = await request(getApp().getHttpServer())
      .delete(`/suggest/${suggestExample.series_id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(suggestUpdateExample)
      .expect(204);
  });
  
});
