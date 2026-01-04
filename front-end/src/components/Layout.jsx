import { Link, useLocation } from 'react-router-dom';
import { useKeycloak } from '../context/KeycloakContext';
import { useUserRole } from '../hooks/useUserRole';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const keycloak = useKeycloak();
  const { isAdmin, isClient } = useUserRole();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getUserDisplayName = () => {
    if (!keycloak || !keycloak.authenticated) return 'Utilisateur';
    const tokenParsed = keycloak.tokenParsed;
    return tokenParsed?.name || tokenParsed?.preferred_username || 'Utilisateur';
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h2>E-Commerce</h2>
          </div>
          <div className="nav-right">
            <div className="nav-links">
              <Link 
                to="/products" 
                className={`nav-link ${isActive('/products') ? 'active' : ''}`}
              >
                Produits
              </Link>
              {isAdmin && (
                <Link 
                  to="/commands" 
                  className={`nav-link ${isActive('/commands') && !isActive('/my-commands') ? 'active' : ''}`}
                >
                  Commandes
                </Link>
              )}
              {isClient && (
                <Link 
                  to="/my-commands" 
                  className={`nav-link ${isActive('/my-commands') ? 'active' : ''}`}
                >
                  Mes Commandes
                </Link>
              )}
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                Profil
              </Link>
            </div>
            {keycloak && keycloak.authenticated && (
              <div className="user-info">
                <span className="user-name">{getUserDisplayName()}</span>
              </div>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
