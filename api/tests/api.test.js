/**
 * Unit tests for User Preferences API
 * test_002: API endpoint testing
 */

const request = require('supertest');
const app = require('../server');
const fs = require('fs').promises;
const path = require('path');

const TEST_DATA_FILE = path.join(__dirname, '..', 'data', 'preferences.json');

// Clean up test data before and after tests
beforeEach(async () => {
  try {
    await fs.unlink(TEST_DATA_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
});

afterEach(async () => {
  try {
    await fs.unlink(TEST_DATA_FILE);
  } catch (error) {
    // File doesn't exist, that's fine
  }
});

describe('User Preferences API', () => {
  
  describe('GET /api/health', () => {
    it('should return health check status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('User Preferences API');
      expect(response.body.timestamp).toBeDefined();
    });
  });
  
  describe('GET /api/preferences', () => {
    it('should return empty preferences when no data exists', async () => {
      const response = await request(app)
        .get('/api/preferences')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual({});
      expect(response.body.count).toBe(0);
    });
  });
  
  describe('POST /api/preferences/:userId', () => {
    it('should create new user preferences', async () => {
      const userId = 'user123';
      const preferences = {
        theme: 'dark',
        language: 'en',
        notifications: true
      };
      
      const response = await request(app)
        .post(`/api/preferences/${userId}`)
        .send(preferences)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('en');
      expect(response.body.data.userId).toBe(userId);
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });
    
    it('should reject invalid preference data', async () => {
      const response = await request(app)
        .post('/api/preferences/user123')
        .send('invalid data')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid preferences data');
    });
  });
  
  describe('GET /api/preferences/:userId', () => {
    it('should retrieve user preferences', async () => {
      const userId = 'user123';
      const preferences = {
        theme: 'dark',
        language: 'en'
      };
      
      // First create preferences
      await request(app)
        .post(`/api/preferences/${userId}`)
        .send(preferences);
      
      // Then retrieve them
      const response = await request(app)
        .get(`/api/preferences/${userId}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('en');
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/api/preferences/nonexistent')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('User preferences not found');
    });
  });
  
  describe('PUT /api/preferences/:userId', () => {
    it('should update existing user preferences', async () => {
      const userId = 'user123';
      const initialPrefs = {
        theme: 'light',
        language: 'en'
      };
      
      // Create initial preferences
      await request(app)
        .post(`/api/preferences/${userId}`)
        .send(initialPrefs);
      
      // Update preferences
      const updates = {
        theme: 'dark'
      };
      
      const response = await request(app)
        .put(`/api/preferences/${userId}`)
        .send(updates)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('en'); // Should remain unchanged
    });
    
    it('should return 404 when updating non-existent user', async () => {
      const response = await request(app)
        .put('/api/preferences/nonexistent')
        .send({ theme: 'dark' })
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
  describe('DELETE /api/preferences/:userId', () => {
    it('should delete user preferences', async () => {
      const userId = 'user123';
      const preferences = {
        theme: 'dark',
        language: 'en'
      };
      
      // Create preferences
      await request(app)
        .post(`/api/preferences/${userId}`)
        .send(preferences);
      
      // Delete preferences
      const response = await request(app)
        .delete(`/api/preferences/${userId}`)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.deletedData).toBeDefined();
      
      // Verify deletion
      const getResponse = await request(app)
        .get(`/api/preferences/${userId}`)
        .expect(404);
    });
    
    it('should return 404 when deleting non-existent user', async () => {
      const response = await request(app)
        .delete('/api/preferences/nonexistent')
        .expect(404);
      
      expect(response.body.success).toBe(false);
    });
  });
  
});
