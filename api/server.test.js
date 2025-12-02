const request = require('supertest');
const app = require('./server');

describe('User Preferences API', () => {
  describe('GET /api/preferences', () => {
    it('should return user preferences with status 200', async () => {
      const response = await request(app).get('/api/preferences');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('theme');
      expect(response.body.data).toHaveProperty('language');
      expect(response.body.data).toHaveProperty('notifications');
      expect(response.body.data).toHaveProperty('fontSize');
      expect(response.body.data).toHaveProperty('autoSave');
    });
  });

  describe('PUT /api/preferences', () => {
    it('should update preferences successfully', async () => {
      const updates = {
        theme: 'dark',
        fontSize: 'large'
      };
      
      const response = await request(app)
        .put('/api/preferences')
        .send(updates)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message');
      expect(response.body.data).toMatchObject(updates);
    });

    it('should return 400 for empty request body', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({})
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Bad Request');
    });

    it('should return 400 for invalid theme value', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({ theme: 'invalid' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Theme must be');
    });

    it('should return 400 for invalid fontSize value', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({ fontSize: 'huge' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Font size must be');
    });

    it('should return 400 for invalid field names', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({ invalidField: 'value' })
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('Invalid fields');
    });

    it('should update multiple preferences at once', async () => {
      const updates = {
        theme: 'dark',
        language: 'es',
        notifications: false,
        fontSize: 'small'
      };
      
      const response = await request(app)
        .put('/api/preferences')
        .send(updates)
        .set('Content-Type', 'application/json');
      
      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject(updates);
    });
  });

  describe('GET /api/health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'API is running');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/api/unknown');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Not Found');
    });
  });
});
