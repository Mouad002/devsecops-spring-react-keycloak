// Centralized API endpoints configuration
const API_BASE_URL = 'http://localhost:8888'; // Change this to your backend URL

export const API_ENDPOINTS = {
  // Products endpoints
  PRODUCTS: {
    LIST: `${API_BASE_URL}/product-service/products`,
    BY_ID: (id) => `${API_BASE_URL}/product-service/products/${id}`,
    CREATE: `${API_BASE_URL}/product-service/products`,
    UPDATE: (id) => `${API_BASE_URL}/product-service/products/${id}`,
    DELETE: (id) => `${API_BASE_URL}/product-service/products/${id}`,
  },
  
  // Commands endpoints
  COMMANDS: {
    LIST: `${API_BASE_URL}/command-service/commands`,
    BY_ID: (id) => `${API_BASE_URL}/command-service/commands/${id}`,
    CREATE: `${API_BASE_URL}/command-service/commands`,
    BY_CLIENT_ID: (clientId) => `${API_BASE_URL}/command-service/commands/client/${clientId}`,
  },
  
  // Auth endpoints (if needed)
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    PROFILE: `${API_BASE_URL}/auth/profile`,
  },
};

export default API_ENDPOINTS;

