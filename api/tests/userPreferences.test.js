/**
 * User Preferences API Tests
 * Integration tests for user preferences endpoints
 */

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

// Mock authentication token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

describe('User Preferences API', () => {
  const testUserId = 'test-user-123';
  let authToken;

  beforeAll(() => {
    authToken = generateToken(testUserId);
  });

  describe('POST /api/preferences', () => {
    it('should create new user preferences', async () => {
      const preferences = {
        userId: testUserId,
        theme: 'dark',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          sms: false
        },
        privacy: {
          profileVisibility: 'private',
          showEmail: false,
          showPhone: false
        }
      };

      const response = await request(app)
        .post('/api/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId', testUserId);
      expect(response.body.data.theme).toBe('dark');
    });

    it('should return 401 without authentication', async () => {
      const preferences = {
        userId: testUserId,
        theme: 'light'
      };

      await request(app)
        .post('/api/preferences')
        .send(preferences)
        .expect(401);
    });

    it('should validate theme values', async () => {
      const preferences = {
        userId: testUserId,
        theme: 'invalid-theme'
      };

      const response = await request(app)
        .post('/api/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send(preferences)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/preferences/:userId', () => {
    it('should retrieve user preferences', async () => {
      const response = await request(app)
        .get(`/api/preferences/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('userId');
    });

    it('should return 404 for non-existent user', async () => {
      const nonExistentToken = generateToken('non-existent-user');
      
      await request(app)
        .get('/api/preferences/non-existent-user')
        .set('Authorization', `Bearer ${nonExistentToken}`)
        .expect(404);
    });

    it('should return 403 when accessing other user preferences', async () => {
      await request(app)
        .get('/api/preferences/other-user-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);
    });
  });

  describe('PUT /api/preferences/:userId', () => {
    it('should update user preferences', async () => {
      const updates = {
        theme: 'light',
        language: 'es',
        notifications: {
          email: false,
          push: true,
          sms: false
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: true,
          showPhone: false
        }
      };

      const response = await request(app)
        .put(`/api/preferences/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('light');
    });
  });

  describe('PATCH /api/preferences/:userId', () => {
    it('should partially update user preferences', async () => {
      const updates = {
        theme: 'auto'
      };

      const response = await request(app)
        .patch(`/api/preferences/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.theme).toBe('auto');
    });
  });

  describe('DELETE /api/preferences/:userId', () => {
    it('should delete user preferences', async () => {
      const response = await request(app)
        .delete(`/api/preferences/${testUserId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('running');
    });
  });
});
