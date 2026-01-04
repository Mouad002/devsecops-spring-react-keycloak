import { Navigate } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';

const ProtectedRoute = ({ children }) => {
  const keycloak = useKeycloak();

  // Show loading while Keycloak is initializing
  if (!keycloak) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Initialisation...</p>
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

