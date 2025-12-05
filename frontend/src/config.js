// API Configuration
// Automatically uses the right URL based on environment
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function for API calls
export const getApiUrl = (endpoint) => `${API_URL}${endpoint}`;
