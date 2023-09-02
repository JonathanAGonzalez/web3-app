import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { Web3AuthProvider } from './providers/Web3Auth.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Web3AuthProvider>
      <App />
    </Web3AuthProvider>
  </React.StrictMode>
);
