import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useUserRole } from '../hooks/useUserRole';
import './CommandsList.css';

const CommandsList = () => {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/products');
      return;
    }
    fetchCommands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.COMMANDS.LIST);
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
        <p>Chargement des commandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchCommands} className="btn-primary">Réessayer</button>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="commands-list">
      <div className="page-header">
        <h1>Liste des Commandes</h1>
      </div>

      {commands.length === 0 ? (
        <div className="empty-state">
          <p>Aucune commande disponible</p>
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

export default CommandsList;

