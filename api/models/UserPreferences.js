/**
 * User Preferences Model
 * Defines the schema and methods for user preferences data
 */

const db = require('../config/database');

class UserPreferences {
  /**
   * Find user preferences by user ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object|null>} User preferences or null
   */
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM user_preferences WHERE user_id = ?';
      const [rows] = await db.execute(query, [userId]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding user preferences: ${error.message}`);
    }
  }

  /**
   * Create new user preferences
   * @param {Object} data - Preference data
   * @returns {Promise<Object>} Created preferences
   */
  static async create(data) {
    try {
      const { userId, theme, language, notifications, privacy } = data;
      const query = `
        INSERT INTO user_preferences 
        (user_id, theme, language, notifications, privacy, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      const notificationsJson = JSON.stringify(notifications || {});
      const privacyJson = JSON.stringify(privacy || {});
      
      const [result] = await db.execute(query, [
        userId,
        theme || 'light',
        language || 'en',
        notificationsJson,
        privacyJson
      ]);
      
      return await this.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error creating user preferences: ${error.message}`);
    }
  }

  /**
   * Update user preferences (full update)
   * @param {string} userId - The user ID
   * @param {Object} data - Updated preference data
   * @returns {Promise<Object|null>} Updated preferences or null
   */
  static async update(userId, data) {
    try {
      const { theme, language, notifications, privacy } = data;
      const query = `
        UPDATE user_preferences 
        SET theme = ?, language = ?, notifications = ?, privacy = ?, updated_at = NOW()
        WHERE user_id = ?
      `;
      
      const notificationsJson = JSON.stringify(notifications || {});
      const privacyJson = JSON.stringify(privacy || {});
      
      const [result] = await db.execute(query, [
        theme,
        language,
        notificationsJson,
        privacyJson,
        userId
      ]);
      
      if (result.affectedRows === 0) {
        return null;
      }
      
      return await this.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error updating user preferences: ${error.message}`);
    }
  }

  /**
   * Partially update user preferences
   * @param {string} userId - The user ID
   * @param {Object} updates - Partial preference updates
   * @returns {Promise<Object|null>} Updated preferences or null
   */
  static async patch(userId, updates) {
    try {
      const currentPreferences = await this.findByUserId(userId);
      if (!currentPreferences) {
        return null;
      }
      
      const fields = [];
      const values = [];
      
      if (updates.theme !== undefined) {
        fields.push('theme = ?');
        values.push(updates.theme);
      }
      if (updates.language !== undefined) {
        fields.push('language = ?');
        values.push(updates.language);
      }
      if (updates.notifications !== undefined) {
        fields.push('notifications = ?');
        values.push(JSON.stringify(updates.notifications));
      }
      if (updates.privacy !== undefined) {
        fields.push('privacy = ?');
        values.push(JSON.stringify(updates.privacy));
      }
      
      if (fields.length === 0) {
        return currentPreferences;
      }
      
      fields.push('updated_at = NOW()');
      values.push(userId);
      
      const query = `UPDATE user_preferences SET ${fields.join(', ')} WHERE user_id = ?`;
      await db.execute(query, values);
      
      return await this.findByUserId(userId);
    } catch (error) {
      throw new Error(`Error patching user preferences: ${error.message}`);
    }
  }

  /**
   * Delete user preferences
   * @param {string} userId - The user ID
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(userId) {
    try {
      const query = 'DELETE FROM user_preferences WHERE user_id = ?';
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting user preferences: ${error.message}`);
    }
  }
}

module.exports = UserPreferences;
