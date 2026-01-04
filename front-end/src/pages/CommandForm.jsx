import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useUserRole } from '../hooks/useUserRole';
import { useKeycloak } from '../context/KeycloakContext';
import './CommandForm.css';

const CommandForm = () => {
  const navigate = useNavigate();
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { isClient } = useUserRole();
  const keycloak = useKeycloak();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isClient) {
      navigate('/products');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.LIST);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Erreur lors du chargement des produits: ' + err.message);
      console.error('Error fetching products:', err);
    }
  };

  const addProduct = () => {
    if (products.length === 0) {
      alert('Aucun produit disponible. Veuillez d\'abord créer des produits.');
      return;
    }
    setSelectedProducts([
      ...selectedProducts,
      { product: products[0], quantity: 1 },
    ]);
  };

  const removeProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProduct = (index, field, value) => {
    const updated = [...selectedProducts];
    if (field === 'product') {
      const product = products.find(p => p.id === value);
      updated[index].product = product;
    } else if (field === 'quantity') {
      updated[index].quantity = parseInt(value) || 1;
    }
    setSelectedProducts(updated);
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedProducts.length === 0) {
      alert('Veuillez ajouter au moins un produit à la commande');
      return;
    }

    // Get clientId from Keycloak token
    const clientId = keycloak?.tokenParsed?.sub;
    if (!clientId) {
      setError('Impossible de récupérer l\'identifiant du client');
      return;
    }

    setLoading(true);
    setError(null);

    const commandData = {
      clientId: clientId,
      products: selectedProducts.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetchWithAuth(API_ENDPOINTS.COMMANDS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commandData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create command');
      }

      navigate('/my-commands');
    } catch (err) {
      setError(err.message);
      console.error('Error creating command:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="command-form">
      <div className="form-header">
        <h1>Créer une commande</h1>
        <button 
          onClick={() => navigate('/my-commands')} 
          className="btn-secondary"
        >
          Annuler
        </button>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="products-section">
          <div className="section-header">
            <h3>Produits</h3>
            <button
              type="button"
              onClick={addProduct}
              className="btn-add-product"
            >
              + Ajouter un produit
            </button>
          </div>

          {selectedProducts.length === 0 ? (
            <p className="no-products-message">
              Aucun produit ajouté. Cliquez sur "Ajouter un produit" pour commencer.
            </p>
          ) : (
            <div className="selected-products">
              {selectedProducts.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-select">
                    <label>Produit *</label>
                    <select
                      value={item.product?.id || ''}
                      onChange={(e) => updateProduct(index, 'product', e.target.value)}
                      required
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.price} € (Stock: {product.quantity})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="quantity-input">
                    <label>Quantité *</label>
                    <input
                      type="number"
                      min="1"
                      max={item.product?.quantity || 1}
                      value={item.quantity}
                      onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="item-total">
                    <label>Total</label>
                    <span>
                      {((item.product?.price || 0) * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="total-section">
              <span className="total-label">Montant total:</span>
              <span className="total-value">{calculateTotal().toFixed(2)} €</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={() => navigate('/my-commands')} 
            className="btn-secondary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || selectedProducts.length === 0}
          >
            {loading ? 'Création...' : 'Créer la commande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommandForm;

