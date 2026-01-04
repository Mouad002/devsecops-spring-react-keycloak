import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API_ENDPOINTS from '../config/api';
import { useAuthenticatedFetch } from '../hooks/useAuthenticatedFetch';
import { useUserRole } from '../hooks/useUserRole';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { fetchWithAuth } = useAuthenticatedFetch();
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/products');
    }
  }, [isAdmin, navigate]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(API_ENDPOINTS.PRODUCTS.BY_ID(id));
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price?.toString() || '',
        quantity: data.quantity?.toString() || '',
      });
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
    };

    try {
      const url = isEdit 
        ? API_ENDPOINTS.PRODUCTS.UPDATE(id)
        : API_ENDPOINTS.PRODUCTS.CREATE;
      
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save product');
      }

      navigate('/products');
    } catch (err) {
      setError(err.message);
      console.error('Error saving product:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <div className="access-message-card">
          <h2>Accès refusé</h2>
          <p>Seuls les administrateurs peuvent ajouter ou modifier des produits.</p>
          <button 
            onClick={() => navigate('/products')} 
            className="btn-primary"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  if (loading && isEdit) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="product-form">
      <div className="form-header">
        <h1>{isEdit ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
        <button 
          onClick={() => navigate('/products')} 
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

        <div className="form-group">
          <label htmlFor="name">Nom du produit *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Entrez le nom du produit"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Entrez la description du produit"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Prix (€) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantité *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button"
            onClick={() => navigate('/products')} 
            className="btn-secondary"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;

