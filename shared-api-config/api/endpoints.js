// 📝 API Endpoints - كل الـ APIs
// File: shared-api-config/api/endpoints.js

import { apiClient } from './client';

// ==================== Auth APIs ====================
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

// ==================== Settings APIs ====================
export const settingsAPI = {
  // Profile
  getProfile: async () => {
    const response = await apiClient.get('/settings/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/settings/profile', data);
    return response.data;
  },

  updateAvatar: async (formData) => {
    const response = await apiClient.post('/settings/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Password
  changePassword: async (data) => {
    const response = await apiClient.put('/settings/password', data);
    return response.data;
  },

  // Preferences
  getPreferences: async () => {
    const response = await apiClient.get('/settings/preferences');
    return response.data;
  },

  updatePreferences: async (data) => {
    const response = await apiClient.put('/settings/preferences', data);
    return response.data;
  },

  // Workspace
  getWorkspace: async () => {
    const response = await apiClient.get('/settings/workspace');
    return response.data;
  },

  updateWorkspace: async (data) => {
    const response = await apiClient.put('/settings/workspace', data);
    return response.data;
  },

  // Automation
  getAutomation: async () => {
    const response = await apiClient.get('/settings/automation');
    return response.data;
  },

  updateAutomation: async (data) => {
    const response = await apiClient.put('/settings/automation', data);
    return response.data;
  },

  // Notifications
  getNotifications: async () => {
    const response = await apiClient.get('/settings/notifications');
    return response.data;
  },

  updateNotifications: async (data) => {
    const response = await apiClient.put('/settings/notifications', data);
    return response.data;
  },
};

// ==================== Team APIs ====================
export const teamAPI = {
  getMembers: async () => {
    const response = await apiClient.get('/team/members');
    return response.data;
  },

  inviteMember: async (data) => {
    const response = await apiClient.post('/team/invite', data);
    return response.data;
  },

  updateMember: async (id, data) => {
    const response = await apiClient.put(`/team/members/${id}`, data);
    return response.data;
  },

  removeMember: async (id) => {
    const response = await apiClient.delete(`/team/members/${id}`);
    return response.data;
  },

  resendInvite: async (id) => {
    const response = await apiClient.post(`/team/members/${id}/resend-invite`);
    return response.data;
  },

  cancelInvite: async (id) => {
    const response = await apiClient.delete(`/team/members/${id}/cancel-invite`);
    return response.data;
  },
};

// ==================== Billing APIs ====================
export const billingAPI = {
  getSubscription: async () => {
    const response = await apiClient.get('/billing/subscription');
    return response.data;
  },

  getInvoices: async () => {
    const response = await apiClient.get('/billing/invoices');
    return response.data;
  },

  getPaymentMethods: async () => {
    const response = await apiClient.get('/billing/payment-methods');
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await apiClient.post('/billing/cancel');
    return response.data;
  },

  upgradePlan: async (planId) => {
    const response = await apiClient.post('/billing/upgrade', { planId });
    return response.data;
  },
};

// ==================== Integrations APIs ====================
export const integrationsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/integrations');
    return response.data;
  },

  connect: async (integrationId, data) => {
    const response = await apiClient.post(`/integrations/${integrationId}/connect`, data);
    return response.data;
  },

  disconnect: async (integrationId) => {
    const response = await apiClient.delete(`/integrations/${integrationId}/disconnect`);
    return response.data;
  },

  getSettings: async (integrationId) => {
    const response = await apiClient.get(`/integrations/${integrationId}/settings`);
    return response.data;
  },

  updateSettings: async (integrationId, data) => {
    const response = await apiClient.put(`/integrations/${integrationId}/settings`, data);
    return response.data;
  },
};

// ==================== Security APIs ====================
export const securityAPI = {
  getSessions: async () => {
    const response = await apiClient.get('/security/sessions');
    return response.data;
  },

  revokeSession: async (sessionId) => {
    const response = await apiClient.delete(`/security/sessions/${sessionId}`);
    return response.data;
  },

  enable2FA: async () => {
    const response = await apiClient.post('/security/2fa/enable');
    return response.data;
  },

  disable2FA: async () => {
    const response = await apiClient.post('/security/2fa/disable');
    return response.data;
  },

  getAPIKeys: async () => {
    const response = await apiClient.get('/security/api-keys');
    return response.data;
  },

  createAPIKey: async (data) => {
    const response = await apiClient.post('/security/api-keys', data);
    return response.data;
  },

  deleteAPIKey: async (keyId) => {
    const response = await apiClient.delete(`/security/api-keys/${keyId}`);
    return response.data;
  },
};

// ==================== Contact APIs ====================
export const contactAPI = {
  getAll: async (params) => {
    const response = await apiClient.get('/contacts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/contacts/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/contacts', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/contacts/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/contacts/stats');
    return response.data;
  },
};

// ==================== Analytics APIs ====================
export const analyticsAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getContacts: async (params) => {
    const response = await apiClient.get('/analytics/contacts', { params });
    return response.data;
  },

  getCampaigns: async (params) => {
    const response = await apiClient.get('/analytics/campaigns', { params });
    return response.data;
  },
};

// ==================== Advanced APIs ====================
export const advancedAPI = {
  getActivityLog: async (params) => {
    const response = await apiClient.get('/settings/activity-log', { params });
    return response.data;
  },

  transferOwnership: async (data) => {
    const response = await apiClient.post('/settings/transfer-ownership', data);
    return response.data;
  },

  deleteWorkspace: async (data) => {
    const response = await apiClient.delete('/settings/workspace', { data });
    return response.data;
  },
};
