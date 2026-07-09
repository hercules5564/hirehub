import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import App from './App';
import './index.css';

// Apply saved theme (light-first: only go dark if the user explicitly chose it).
const theme = localStorage.getItem('theme');
if (theme === 'dark') {
  document.documentElement.classList.add('dark');
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { borderRadius: '8px', background: '#111827', color: '#f9fafb', fontSize: '14px', border: '1px solid #1f2937' },
        }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
