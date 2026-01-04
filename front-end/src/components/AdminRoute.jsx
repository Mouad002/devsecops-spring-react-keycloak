import { Navigate } from 'react-router-dom';
import { useUserRole } from '../hooks/useUserRole';

const AdminRoute = ({ children }) => {
  const { isAdmin } = useUserRole();

  if (!isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
};

export default AdminRoute;

