import { useState, useEffect } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import './Profile.css';

const Profile = () => {
  const keycloak = useKeycloak();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (keycloak && keycloak.authenticated) {
      // Get user info from Keycloak token
      const userInfo = keycloak.tokenParsed;
      const userProfile = {
        id: userInfo.sub || userInfo.preferred_username,
        name: userInfo.name || userInfo.preferred_username || 'Utilisateur',
        email: userInfo.email || 'N/A',
        username: userInfo.preferred_username || 'N/A',
        roles: keycloak.realmAccess?.roles || [],
        firstName: userInfo.given_name || '',
        lastName: userInfo.family_name || '',
      };
      
      // Get CLIENT or ADMIN role from realm_access (there's always one of them)
      const primaryRole = userProfile.roles.find(role => 
        ['CLIENT', 'ADMIN'].includes(role.toUpperCase())
      )?.toUpperCase() || 'CLIENT'; // Default to CLIENT if not found
      
      setUser({
        ...userProfile,
        role: primaryRole,
      });
    }
    setLoading(false);
  }, [keycloak]);

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      keycloak.logout();
    }
  };

  const getRoleColor = (role) => {
    const roleColors = {
      'ADMIN': '#ff6b1a',
      'CLIENT': '#4caf50',
    };
    return roleColors[role?.toUpperCase()] || '#666';
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      'ADMIN': 'Administrateur',
      'CLIENT': 'Client',
    };
    return roleLabels[role?.toUpperCase()] || role || 'Client';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="profile">
      <div className="profile-header">
        <h1>Mon Profil</h1>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>

        <div className="profile-info">
          <div className="info-section">
            <h3>Informations personnelles</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Nom complet</span>
                <span className="info-value">{user?.name || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Nom d'utilisateur</span>
                <span className="info-value">{user?.username || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ID utilisateur</span>
                <span className="info-value">{user?.id || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="role-section">
            <h3>Rôle</h3>
            <div className="role-badge-container">
              <span 
                className="role-badge"
                style={{ backgroundColor: getRoleColor(user?.role) }}
              >
                {getRoleLabel(user?.role)}
              </span>
            </div>
            {user?.roles && user.roles.length > 1 && (
              <div className="all-roles">
                <p className="roles-label">Tous les rôles:</p>
                <div className="roles-list">
                  {user.roles.map((role, index) => (
                    <span key={index} className="role-tag">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button onClick={handleLogout} className="btn-logout">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
