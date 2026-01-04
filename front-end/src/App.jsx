import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { KeycloakProvider } from './context/KeycloakContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ClientRoute from './components/ClientRoute';
import Layout from './components/Layout';
import ProductsList from './pages/ProductsList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import CommandsList from './pages/CommandsList';
import MyCommands from './pages/MyCommands';
import CommandDetail from './pages/CommandDetail';
import CommandForm from './pages/CommandForm';
import Profile from './pages/Profile';
import './App.css';

function App({ keycloak }) {
  return (
    <KeycloakProvider keycloak={keycloak}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route 
              path="/products" 
              element={
                <ProtectedRoute>
                  <ProductsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products/new" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products/edit/:id" 
              element={
                <ProtectedRoute>
                  <ProductForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/products/:id" 
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commands" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <CommandsList />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-commands" 
              element={
                <ProtectedRoute>
                  <ClientRoute>
                    <MyCommands />
                  </ClientRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commands/new" 
              element={
                <ProtectedRoute>
                  <ClientRoute>
                    <CommandForm />
                  </ClientRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commands/:id" 
              element={
                <ProtectedRoute>
                  <CommandDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </KeycloakProvider>
  );
}

export default App;
