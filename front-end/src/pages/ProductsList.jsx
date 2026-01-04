import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useUserRole } from '../hooks/useUserRole';
import './ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.LIST);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.DELETE(id), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={fetchProducts} className="btn-primary">Réessayer</button>
      </div>
    );
  }

  return (
    <div className="products-list">
      <div className="page-header">
        <h1>Liste des Produits</h1>
        {isAdmin ? (
          <button 
            onClick={() => navigate('/products/new')} 
            className="btn-primary"
          >
            + Ajouter un produit
          </button>
        ) : (
          <div className="access-message">
            <p>Seuls les administrateurs peuvent ajouter, modifier ou supprimer des produits.</p>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>Aucun produit disponible</p>
          {isAdmin && (
            <button 
              onClick={() => navigate('/products/new')} 
              className="btn-primary"
            >
              Créer le premier produit
            </button>
          )}
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <span className="product-price">{product.price} €</span>
              </div>
              <p className="product-description">{product.description}</p>
              <div className="product-info">
                <span className="product-quantity">
                  Stock: {product.quantity}
                </span>
              </div>
              <div className="product-actions">
                <Link 
                  to={`/products/${product.id}`} 
                  className="btn-secondary"
                >
                  Voir détails
                </Link>
                {isAdmin && (
                  <>
                    <button
                      onClick={() => navigate(`/products/edit/${product.id}`)}
                      className="btn-edit"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn-delete"
                    >
                      Supprimer
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;

