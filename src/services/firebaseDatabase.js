import { ref, push, set, get, update, onValue, off } from 'firebase/database';
import { database } from '../firebase';
import { getAuth } from 'firebase/auth';

class FirebaseDatabaseService {
  constructor() {
    this.auth = getAuth();
  }

  // Get current user ID
  getCurrentUserId() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user.uid;
  }

  // ============================================
  // CHAT HISTORY MANAGEMENT
  // ============================================

  /**
   * Save a new chat session
   * @param {Object} chatData - { messages: [], sessionId: string, metadata: {} }
   */
  async saveChatSession(chatData) {
    try {
      const userId = this.getCurrentUserId();
      const chatRef = ref(database, `chatHistory/${userId}`);

      const newChatRef = push(chatRef);
      await set(newChatRef, {
        ...chatData,
        timestamp: Date.now(),
        userId
      });

      return newChatRef.key;
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  }

  /**
   * Update existing chat session
   * @param {string} sessionId - Chat session ID
   * @param {Object} updates - Data to update
   */
  async updateChatSession(sessionId, updates) {
    try {
      const userId = this.getCurrentUserId();
      const chatRef = ref(database, `chatHistory/${userId}/${sessionId}`);

      await update(chatRef, {
        ...updates,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error updating chat session:', error);
      throw error;
    }
  }

  /**
   * Get user's chat history
   * @param {number} limit - Number of recent chats to fetch
   */
  async getChatHistory(limit = 50) {
    try {
      const userId = this.getCurrentUserId();
      const chatRef = ref(database, `chatHistory/${userId}`);

      const snapshot = await get(chatRef);
      if (!snapshot.exists()) {
        return [];
      }

      const chats = [];
      snapshot.forEach((childSnapshot) => {
        chats.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      // Sort by timestamp (most recent first) and limit results
      return chats
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  /**
   * Listen to real-time chat updates
   * @param {Function} callback - Callback function for updates
   * @param {string} sessionId - Specific session ID (optional)
   */
  listenToChatUpdates(callback, sessionId = null) {
    try {
      const userId = this.getCurrentUserId();
      const path = sessionId
        ? `chatHistory/${userId}/${sessionId}`
        : `chatHistory/${userId}`;

      const chatRef = ref(database, path);
      onValue(chatRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
      });

      // Return cleanup function
      return () => off(chatRef);
    } catch (error) {
      console.error('Error listening to chat updates:', error);
      throw error;
    }
  }

  // ============================================
  // REPORT ANALYZER
  // ============================================

  /**
   * Save report analysis
   * @param {Object} reportData - { type, content, analysis, metadata }
   */
  async saveReportAnalysis(reportData) {
    try {
      const userId = this.getCurrentUserId();
      const reportRef = ref(database, `reports/${userId}`);

      const newReportRef = push(reportRef);
      await set(newReportRef, {
        ...reportData,
        timestamp: Date.now(),
        userId
      });

      return newReportRef.key;
    } catch (error) {
      console.error('Error saving report analysis:', error);
      throw error;
    }
  }

  /**
   * Get user's reports
   * @param {string} type - Filter by report type (optional)
   */
  async getReports(type = null) {
    try {
      const userId = this.getCurrentUserId();
      const reportsRef = ref(database, `reports/${userId}`);

      const snapshot = await get(reportsRef);
      if (!snapshot.exists()) {
        return [];
      }

      const reports = [];
      snapshot.forEach((childSnapshot) => {
        const report = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };
        if (!type || report.reportData.type === type) {
          reports.push(report);
        }
      });

      return reports.sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Error getting reports:', error);
      throw error;
    }
  }

  // ============================================
  // DASHBOARD ANALYTICS
  // ============================================

  /**
   * Update dashboard data
   * @param {Object} dashboardData - Dashboard metrics and stats
   */
  async updateDashboard(dashboardData) {
    try {
      const userId = this.getCurrentUserId();
      const dashboardRef = ref(database, `dashboard/${userId}`);

      await set(dashboardRef, {
        ...dashboardData,
        lastUpdated: Date.now(),
        userId
      });
    } catch (error) {
      console.error('Error updating dashboard:', error);
      throw error;
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData() {
    try {
      const userId = this.getCurrentUserId();
      const dashboardRef = ref(database, `dashboard/${userId}`);

      const snapshot = await get(dashboardRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }

  // ============================================
  // HEALTH TRACKING
  // ============================================

  /**
   * Save health data
   * @param {Object} healthData - Vitals, symptoms, etc.
   */
  async saveHealthData(healthData) {
    try {
      const userId = this.getCurrentUserId();
      const healthRef = ref(database, `healthTracking/${userId}/logs`);

      const newEntryRef = push(healthRef);
      await set(newEntryRef, {
        ...healthData,
        timestamp: Date.now()
      });

      return newEntryRef.key;
    } catch (error) {
      console.error('Error saving health data:', error);
      throw error;
    }
  }

  /**
   * Get health tracking data
   * @param {number} limit - Number of recent entries
   */
  async getHealthData(limit = 100) {
    try {
      const userId = this.getCurrentUserId();
      const healthRef = ref(database, `healthTracking/${userId}/logs`);

      const snapshot = await get(healthRef);
      if (!snapshot.exists()) {
        return [];
      }

      const entries = [];
      snapshot.forEach((childSnapshot) => {
        entries.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });

      return entries
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting health data:', error);
      throw error;
    }
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  /**
   * Clean up old data (older than specified days)
   * @param {number} daysOld - Remove data older than this many days
   */
  async cleanupOldData(daysOld = 90) {
    try {
      const userId = this.getCurrentUserId();
      const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

      // Clean up old chat sessions
      const chatRef = ref(database, `chatHistory/${userId}`);
      const chatSnapshot = await get(chatRef);
      if (chatSnapshot.exists()) {
        const updates = {};
        chatSnapshot.forEach((child) => {
          const chatData = child.val();
          if (chatData.timestamp < cutoffTime) {
            updates[child.key] = null; // Delete
          }
        });
        if (Object.keys(updates).length > 0) {
          await update(chatRef, updates);
        }
      }

      console.log(`Cleaned up data older than ${daysOld} days for user ${userId}`);
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseDB = new FirebaseDatabaseService();
export default firebaseDB;