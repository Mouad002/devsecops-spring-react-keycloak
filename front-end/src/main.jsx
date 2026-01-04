import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import keycloak from './keycloak.js'

keycloak.init({
  onLoad: "login-required",
  pkceMethod: "S256",
  checkLoginIframe: false,
}).then((authenticated) => {
  if (!authenticated) {
    window.location.reload();
  }

  const root = createRoot(document.getElementById('root'));
  root.render(
    <StrictMode>
      <App keycloak={keycloak} />
    </StrictMode>
  );
}).catch(() => {
  console.error("Failed to initialize Keycloak");
});
