import { useKeycloak } from '../context/KeycloakContext';
import { useMemo } from 'react';

export const useUserRole = () => {
  const keycloak = useKeycloak();

  const userRole = useMemo(() => {
    if (!keycloak || !keycloak.authenticated) {
      return null;
    }

    const roles = keycloak.realmAccess?.roles || [];
    const role = roles.find(r => ['CLIENT', 'ADMIN'].includes(r.toUpperCase()));
    return role?.toUpperCase() || 'CLIENT';
  }, [keycloak]);

  const isAdmin = userRole === 'ADMIN';
  const isClient = userRole === 'CLIENT';

  return { userRole, isAdmin, isClient };
};

