import { useKeycloak } from '../context/KeycloakContext';
import { authenticatedFetch, getAuthHeaders } from '../utils/apiClient';

export const useAuthenticatedFetch = () => {
  const keycloak = useKeycloak();

  const fetchWithAuth = async (url, options = {}) => {
    return authenticatedFetch(keycloak, url, options);
  };

  const getHeaders = () => {
    return getAuthHeaders(keycloak);
  };

  return { fetchWithAuth, getHeaders };
};

