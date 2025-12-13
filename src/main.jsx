import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter } from "react-router-dom";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain="dev-z7f0pa7bzijpitop.us.auth0.com"
    clientId="g18xrpJvp0Ja3CY2Hi8vIZGBRGrX6vZU"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://cdls-api"  
    }}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>
)
