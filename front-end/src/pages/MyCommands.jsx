import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useKeycloak } from '../context/KeycloakContext';
import './CommandsList.css';

const MyCommands = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuthenticatedFetch();
  const keycloak = useKeycloak();

  useEffect(() => {
    fetchMyCommands();
  }, []);

  const fetchMyCommands = async () => {
    try {
      setLoading(true);
      // Get clientId from Keycloak token (using sub as clientId)
      const clientId = keycloak?.tokenParsed?.sub;
      if (!clientId) {
        throw new Error('Client ID not found');
      }

      const response = await fetchWithAuth(API_ENDPOINTS.COMMANDS.BY_CLIENT_ID(clientId));
      if (!response.ok) throw new Error('Failed to fetch commands');
      const data = await response.json();
      setCommands(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching commands:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'PENDING': '#ffa64d',
      'CONFIRMED': '#4caf50',
      'SHIPPED': '#2196f3',
      'DELIVERED': '#4caf50',
      'CANCELLED': '#ff4444',
    };
    return statusColors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement de vos commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchMyCommands} className="btn-primary">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="commands-list">
      <div className="page-header">
        <h1>Mes Commandes</h1>
        <button 
          onClick={() => navigate('/commands/new')} 
          className="btn-primary"
        >
          + Créer une commande
        </button>
      </div>

      {commands.length === 0 ? (
        <div className="empty-state">
          <p>Aucune commande disponible</p>
          <button 
            onClick={() => navigate('/commands/new')} 
            className="btn-primary"
          >
            Créer ma première commande
          </button>
        </div>
      ) : (
        <div className="commands-grid">
          {commands.map((command) => (
            <div key={command.id} className="command-card">
              <div className="command-header">
                <div>
                  <h3>Commande #{command.id}</h3>
                  <p className="command-date">{formatDate(command.date)}</p>
                </div>
                <span 
                  className="command-status"
                  style={{ backgroundColor: getStatusColor(command.status) }}
                >
                  {command.status}
                </span>
              </div>
              
              <div className="command-info">
                <div className="info-row">
                  <span className="info-label">Montant total:</span>
                  <span className="info-value">{command.amount} €</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Produits:</span>
                  <span className="info-value">
                    {command.products?.length || 0} article(s)
                  </span>
                </div>
              </div>

              <div className="command-actions">
                <Link 
                  to={`/commands/${command.id}`} 
                  className="btn-primary"
                >
                  Voir détails
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCommands;

