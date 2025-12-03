/**
 * API Utility Functions
 * Handles API calls and token management
 */

// Use proxy in development (via Vite), or direct URL in production
// In development, Vite proxy forwards /api/* to http://127.0.0.1:8000/*
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://127.0.0.1:8000';

/**
 * Get stored access token from localStorage
 * @returns {string|null} Access token or null
 */
export const getToken = () => {
  return localStorage.getItem('access_token');
};

/**
 * Store access token in localStorage
 * @param {string} token - Access token to store
 */
export const setToken = (token) => {
  localStorage.setItem('access_token', token);
};

/**
 * Remove access token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('access_token');
};

/**
 * Get authorization header with token
 * @returns {Object} Headers object with Authorization header
 */
export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'accept': 'application/json',
    ...options.headers
  };

  // Add auth token if available (unless explicitly excluded)
  if (!options.skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Remove custom options that aren't part of fetch API
  const { skipAuth, ...fetchOptions } = options;
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Login API call
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with user data and token
 */
export const loginAPI = async (email, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({ email, password })
  });

  // Store token
  if (response.access_token) {
    setToken(response.access_token);
  }

  return response;
};

