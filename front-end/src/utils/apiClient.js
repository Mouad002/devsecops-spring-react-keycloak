import { useKeycloak } from '../context/KeycloakContext';

// Helper function to get authenticated fetch options
export const getAuthHeaders = (keycloak) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (keycloak && keycloak.authenticated && keycloak.token) {
    headers['Authorization'] = `Bearer ${keycloak.token}`;
  }
  console.log(keycloak.token);

  return headers;
};

// Helper function to make authenticated fetch requests
export const authenticatedFetch = async (keycloak, url, options = {}) => {
  const headers = getAuthHeaders(keycloak);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  // If token expired, try to refresh
  if (response.status === 401 && keycloak) {
    try {
      await keycloak.updateToken(30);
      const newHeaders = getAuthHeaders(keycloak);
      return fetch(url, {
        ...options,
        headers: {
          ...newHeaders,
          ...options.headers,
        },
      });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      keycloak.logout();
    }
  }

  return response;
};

