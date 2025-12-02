/**
 * User Preferences API Tests
 * 
 * Tests for GET and PUT endpoints with various scenarios
 */

const request = require('supertest');
const express = require('express');
const preferencesRouter = require('./preferences');

// Setup test app
const app = express();
app.use(express.json());
app.use('/api/preferences', preferencesRouter);

describe('User Preferences API', () => {
  
  describe('GET /api/preferences', () => {
    
    test('should return default preferences for new user', async () => {
      const response = await request(app)
        .get('/api/preferences?userId=user123')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('theme');
      expect(response.body.data).toHaveProperty('language');
      expect(response.body.data).toHaveProperty('notifications');
      expect(response.body.data).toHaveProperty('privacy');
      expect(response.body.userId).toBe('user123');
    });
    
    test('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .get('/api/preferences')
        .expect(400);
      
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toBe('User ID is required');
    });
    
    test('should return previously saved preferences', async () => {
      // First, save some preferences
      const preferencesToSave = {
        theme: 'dark',
        language: 'es'
      };
      
      await request(app)
        .put('/api/preferences?userId=user456')
        .send(preferencesToSave)
        .expect(200);
      
      // Then retrieve them
      const response = await request(app)
        .get('/api/preferences?userId=user456')
        .expect(200);
      
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('es');
    });
  });
  
  describe('PUT /api/preferences', () => {
    
    test('should update user preferences successfully', async () => {
      const newPreferences = {
        theme: 'dark',
        language: 'fr',
        notifications: {
          email: false,
          push: true
        }
      };
      
      const response = await request(app)
        .put('/api/preferences?userId=user789')
        .send(newPreferences)
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Preferences updated successfully');
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('fr');
      expect(response.body.data.notifications.email).toBe(false);
      expect(response.body.data.notifications.push).toBe(true);
    });
    
    test('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .send({ theme: 'dark' })
        .expect(400);
      
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toBe('User ID is required');
    });
    
    test('should return 400 when request body is empty', async () => {
      const response = await request(app)
        .put('/api/preferences?userId=user999')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toBe('Preferences data is required');
    });
    
    test('should return 400 for invalid theme value', async () => {
      const response = await request(app)
        .put('/api/preferences?userId=user999')
        .send({ theme: 'invalid-theme' })
        .expect(400);
      
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Invalid theme value');
    });
    
    test('should return 400 for invalid notification settings', async () => {
      const response = await request(app)
        .put('/api/preferences?userId=user999')
        .send({
          notifications: {
            email: 'not-a-boolean'
          }
        })
        .expect(400);
      
      expect(response.body.error).toBe('Bad Request');
      expect(response.body.message).toContain('Invalid notifications');
    });
    
    test('should merge preferences with existing ones', async () => {
      const userId = 'user-merge-test';
      
      // First update
      await request(app)
        .put(`/api/preferences?userId=${userId}`)
        .send({
          theme: 'dark',
          notifications: { email: false }
        })
        .expect(200);
      
      // Second update (partial)
      const response = await request(app)
        .put(`/api/preferences?userId=${userId}`)
        .send({
          language: 'de'
        })
        .expect(200);
      
      // Should preserve previous theme and notification settings
      expect(response.body.data.theme).toBe('dark');
      expect(response.body.data.language).toBe('de');
      expect(response.body.data.notifications.email).toBe(false);
    });
    
    test('should handle deep merge of nested objects', async () => {
      const userId = 'user-nested-test';
      
      // First update
      await request(app)
        .put(`/api/preferences?userId=${userId}`)
        .send({
          notifications: {
            email: false,
            push: true,
            sms: false
          }
        })
        .expect(200);
      
      // Partial update of notifications
      const response = await request(app)
        .put(`/api/preferences?userId=${userId}`)
        .send({
          notifications: {
            push: false
          }
        })
        .expect(200);
      
      // Should preserve email and sms settings
      expect(response.body.data.notifications.email).toBe(false);
      expect(response.body.data.notifications.push).toBe(false);
      expect(response.body.data.notifications.sms).toBe(false);
    });
  });
  
  describe('Error Handling', () => {
    
    test('should handle server errors gracefully', async () => {
      // This test would require mocking to simulate actual server errors
      // For now, we verify the error response structure
      const response = await request(app)
        .get('/api/preferences')
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('message');
    });
  });
});