import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

const ClientRoute = ({ children }) => {
  const { isClient } = useUserRole();

  if (!isClient) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default ClientRoute;

