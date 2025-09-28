import request from 'supertest';
import { setupTestApp } from '../utils/test-setup';

// Ensure SSL is disabled for Keycloak tests
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe('Keycloak Authentication (e2e)', () => {
  const getApp = setupTestApp();
  beforeAll(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  });

  //
  //------------------------- Keycloak Authentication-------------------------------
  //
  describe('Keycloak Authentication', () => {
    //
    // return login keycloak
    //
    it('/keycloak/login should redirect to Keycloak or return error', async () => {
      // Test against actual running API server instead of test server
      const response = await request('http://localhost:3000')
        .get('/api/v1/keycloak/login')
        .expect(302);

      // Verify redirect details
      expect(response.headers.location).toBeDefined();
      const location = response.headers.location;
      expect(location).toContain('/realms/Devpool_project');
      expect(location).toContain('client_id=seely');
      expect(location).toContain('state=');
      expect(location).toContain(
        'redirect_uri=http://localhost:3000/api/v1/keycloak/callback',
      );
    });

    
    //------------------------- Keycloak Logout Test-------------------------------
    
    describe('Keycloak Logout Flow', () => {
      it('/keycloak/logout should redirect to Keycloak logout', async () => {       
        const response = await request('http://localhost:3000')
          .get('/api/v1/keycloak/logout')
          .expect(302);
        
        expect(response.headers.location).toBeDefined();
        const location = response.headers.location;
        expect(location).toContain(
          'http://localhost:3000/api/v1/keycloak/logout-success',
        );
      });
    });
  });
});
