/**
 * User Preferences API Tests
 * 
 * Comprehensive test suite for the preferences endpoints
 */

const request = require('supertest');
const app = require('../server');

describe('User Preferences API', () => {
  let testUserId;
  
  // Test data
  const testPreferences = {
    theme: 'dark',
    notifications: true,
    language: 'en',
    displaySettings: {
      fontSize: 'medium',
      density: 'comfortable'
    },
    customSettings: {
      autoSave: true,
      showTips: false
    }
  };
  
  describe('GET /', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
    });
  });
  
  describe('POST /api/preferences', () => {
    it('should create new preferences', async () => {
      const response = await request(app)
        .post('/api/preferences')
        .send(testPreferences);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
      expect(response.body.data.theme).toBe('dark');
      
      testUserId = response.body.data.userId;
    });
    
    it('should create preferences with default values', async () => {
      const response = await request(app)
        .post('/api/preferences')
        .send({});
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('light');
      expect(response.body.data.notifications).toBe(true);
    });
    
    it('should reject invalid theme value', async () => {
      const response = await request(app)
        .post('/api/preferences')
        .send({ theme: 'invalid' });
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
    
    it('should reject duplicate user ID', async () => {
      const response = await request(app)
        .post('/api/preferences')
        .send({ ...testPreferences, userId: testUserId });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('GET /api/preferences', () => {
    it('should retrieve all preferences', async () => {
      const response = await request(app).get('/api/preferences');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
  
  describe('GET /api/preferences/:userId', () => {
    it('should retrieve specific user preferences', async () => {
      const response = await request(app)
        .get(`/api/preferences/${testUserId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.userId).toBe(testUserId);
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/preferences/non-existent-id');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PUT /api/preferences/:userId', () => {
    it('should fully update preferences', async () => {
      const updatedPrefs = {
        theme: 'light',
        notifications: false,
        language: 'es',
        displaySettings: {
          fontSize: 'large',
          density: 'compact'
        },
        customSettings: {}
      };
      
      const response = await request(app)
        .put(`/api/preferences/${testUserId}`)
        .send(updatedPrefs);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('light');
      expect(response.body.data.language).toBe('es');
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .put('/api/preferences/non-existent-id')
        .send(testPreferences);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('PATCH /api/preferences/:userId', () => {
    it('should partially update preferences', async () => {
      const response = await request(app)
        .patch(`/api/preferences/${testUserId}`)
        .send({ theme: 'dark' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('dark');
      // Other fields should remain unchanged
      expect(response.body.data).toHaveProperty('notifications');
    });
    
    it('should update nested display settings', async () => {
      const response = await request(app)
        .patch(`/api/preferences/${testUserId}`)
        .send({ displaySettings: { fontSize: 'small' } });
      
      expect(response.status).toBe(200);
      expect(response.body.data.displaySettings.fontSize).toBe('small');
    });
  });
  
  describe('DELETE /api/preferences/:userId', () => {
    it('should delete user preferences', async () => {
      const response = await request(app)
        .delete(`/api/preferences/${testUserId}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    it('should return 404 when deleting non-existent preferences', async () => {
      const response = await request(app)
        .delete(`/api/preferences/${testUserId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('Error Handling', () => {
    it('should handle 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });
});