import request from 'supertest';
import { setupTestApp, TestSetup } from '../utils/test-setup';

describe('serires e2e test', () => {
  const getApp = setupTestApp();

  describe('/users/me for check access token', () => {
    const loginData = {
      username: 'apinut',
      password: '1234',
      role: 'USER',
    };
    const exampleCreateSerie = {
      name: 'Donut movie',
      year: 2008,
      review: 'ผลงานชิ้นเอกของ Donut',
      imageUrl: 'https://example.com/images/dark-knight.jpg',
      rating: {
        id: 4,
      },
    };
    const exampleUpdateSerie = {
      name: 'Apinut movie2',
      year: 2011,
      review: 'ผลงานชิ้นเอกของ Donut',
      imageUrl: 'https://example.com/images/Apinut2.jpg',
      rating: {
        id: 5,
      },
    };

    let createdSeriesId: number;
    
    // -----------------Create serie-------------------------------
    it('/series Should create series and success', async () => {
      // Create user and get token
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .post('/series')
        .send(exampleCreateSerie)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      // เก็บ ID ที่ได้จากการสร้าง
      createdSeriesId = response.body.id;

      // Verify response contains user information
      expect(response.body).toBeDefined();
      expect(response.body.id).toBeDefined(); // ตรวจสอบว่ามี id
      expect(response.body.name).toBe(exampleCreateSerie.name);
      expect(response.body.year).toBe(exampleCreateSerie.year);
      expect(response.body.review).toBe(exampleCreateSerie.review);
      expect(response.body.imageUrl).toBe(exampleCreateSerie.imageUrl);
      expect(response.body.rating.id).toBe(exampleCreateSerie.rating.id);
    });
    // -----------------Patch serie-------------------------------
    it('/series Should patch series and success', async () => {
      // Get token (user should already exist from previous test)
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .patch(`/series/${createdSeriesId}`) // ใช้ ID ที่เก็บไว้
        .send(exampleUpdateSerie)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify response contains user information
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(createdSeriesId); 
      expect(response.body.name).toBe(exampleUpdateSerie.name);
      expect(response.body.year).toBe(exampleUpdateSerie.year);
      expect(response.body.review).toBe(exampleUpdateSerie.review);
      expect(response.body.imageUrl).toBe(exampleUpdateSerie.imageUrl);
      expect(response.body.rating.id).toBe(exampleUpdateSerie.rating.id);
    });
    // -----------------Get serie By id-------------------------------
    it('/series/:id Should GET series and success', async () => {
      // Get token (user should already exist from previous test)
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .get(`/series/${createdSeriesId}`) 
        .expect(200);

      // Verify response contains user information
      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(createdSeriesId); 
      expect(response.body.name).toBe(exampleUpdateSerie.name);
      expect(response.body.year).toBe(exampleUpdateSerie.year);
      expect(response.body.review).toBe(exampleUpdateSerie.review);
      expect(response.body.imageUrl).toBe(exampleUpdateSerie.imageUrl);
      expect(response.body.rating.id).toBe(exampleUpdateSerie.rating.id);
    });
    // -----------------Get Myserie-------------------------------
    it('/series/myserie Should GET Myseries and success', async () => {
      // Get token (user should already exist from previous test)
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .get(`/series/myserie?page=1&limit=5&search=`) 
        .set('Authorization', `Bearer ${accessToken}`) // เพิ่ม token เพราะเป็น myserie
        .expect(200);
    
      expect(response.body).toBeDefined();     
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      // ตรวจสอบว่า data เป็น array
      expect(Array.isArray(response.body.data)).toBe(true);
      // ตรวจสอบ meta pagination      
      expect(response.body.meta).toHaveProperty('itemsPerPage');
      // ตรวจสอบว่าผลลัพธ์ไม่เกิน limit
      expect(response.body.data.length).toBeLessThanOrEqual(5);     
    });
    // -----------------Get pagination-------------------------------
    it('/series/myserie Should GET Myseries and success', async () => {
      // Get token (user should already exist from previous test)
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .get(`/series?page=1&limit=5&search=`) 
        .set('Authorization', `Bearer ${accessToken}`) // เพิ่ม token เพราะเป็น myserie
        .expect(200);
    
      expect(response.body).toBeDefined();     
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      // ตรวจสอบว่า data เป็น array
      expect(Array.isArray(response.body.data)).toBe(true);
      // ตรวจสอบ meta pagination      
      expect(response.body.meta).toHaveProperty('itemsPerPage');
      // ตรวจสอบว่าผลลัพธ์ไม่เกิน limit
      expect(response.body.data.length).toBeLessThanOrEqual(5);     
    });
    // -----------------DELETE Myserie-------------------------------
    it('/series/:id Should Delete Myseries and success', async () => {
      // Get token (user should already exist from previous test)
      const { accessToken, refreshToken } = await TestSetup.loginAndGetTokens(
        getApp(),
        loginData,
      );

      // Use token to get current user info
      const response = await request(getApp().getHttpServer())
        .delete(`/series/${createdSeriesId}`) 
        .set('Authorization', `Bearer ${accessToken}`) 
        .expect(200);
    });
  });
});
