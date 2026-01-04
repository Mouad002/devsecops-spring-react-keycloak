import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useUserRole } from '../hooks/useUserRole';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setProduct(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.DELETE(id), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      navigate('/products');
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <p>Erreur: {error || 'Produit non trouvé'}</p>
        <Link to="/products" className="btn-primary">Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-header">
        <Link to="/products" className="back-link">← Retour à la liste</Link>
        {isAdmin ? (
          <div className="detail-actions">
            <button
              onClick={() => navigate(`/products/edit/${id}`)}
              className="btn-edit"
            >
              Modifier
            </button>
            <button onClick={handleDelete} className="btn-delete">
              Supprimer
            </button>
          </div>
        ) : (
          <div className="access-message">
            <p>Seuls les administrateurs peuvent modifier ou supprimer des produits.</p>
          </div>
        )}
      </div>

      <div className="detail-card">
        <div className="detail-content">
          <h1>{product.name}</h1>
          <div className="detail-price">
            <span className="price-label">Prix:</span>
            <span className="price-value">{product.price} €</span>
          </div>
          
          <div className="detail-section">
            <h3>Description</h3>
            <p>{product.description || 'Aucune description disponible'}</p>
          </div>

          <div className="detail-info-grid">
            <div className="info-item">
              <span className="info-label">ID:</span>
              <span className="info-value">{product.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quantité en stock:</span>
              <span className={`info-value ${product.quantity === 0 ? 'out-of-stock' : ''}`}>
                {product.quantity}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

