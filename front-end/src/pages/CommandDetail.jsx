import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import './CommandDetail.css';

const CommandDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [command, setCommand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuthenticatedFetch();

  useEffect(() => {
    fetchCommand();
  }, [id]);

  const fetchCommand = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.COMMANDS.BY_ID(id));
      if (!response.ok) throw new Error('Failed to fetch command');
      const data = await response.json();
      setCommand(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching command:', err);
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
        <p>Chargement de la commande...</p>
      </div>
    );
  }

  if (error || !command) {
    return (
      <div className="error-container">
        <p>Erreur: {error || 'Commande non trouvée'}</p>
        <Link to="/commands" className="btn-primary">Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="command-detail">
      <div className="detail-header">
        <Link to="/commands" className="back-link">← Retour à la liste</Link>
      </div>

      <div className="detail-card">
        <div className="detail-content">
          <div className="command-title-section">
            <h1>Commande #{command.id}</h1>
            <span 
              className="command-status-badge"
              style={{ backgroundColor: getStatusColor(command.status) }}
            >
              {command.status}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">Date de commande:</span>
              <span className="info-value">{formatDate(command.date)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Statut:</span>
              <span 
                className="info-value"
                style={{ color: getStatusColor(command.status) }}
              >
                {command.status}
              </span>
            </div>
            <div className="info-item highlight">
              <span className="info-label">Montant total:</span>
              <span className="info-value amount">{command.amount} €</span>
            </div>
          </div>

          <div className="products-section">
            <h3>Produits de la commande</h3>
            {command.products && command.products.length > 0 ? (
              <div className="products-table">
                <div className="table-header">
                  <div>Produit</div>
                  <div>Prix unitaire</div>
                  <div>Quantité</div>
                  <div>Total</div>
                </div>
                {command.products.map((cmdProduct, index) => (
                  <div key={index} className="table-row">
                    <div className="product-name">
                      {cmdProduct.product?.name || 'Produit inconnu'}
                    </div>
                    <div>{cmdProduct.product?.price || 0} €</div>
                    <div>{cmdProduct.quantity}</div>
                    <div className="row-total">
                      {(cmdProduct.product?.price || 0) * cmdProduct.quantity} €
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-products">Aucun produit dans cette commande</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandDetail;

