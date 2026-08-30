import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { RestaurantProvider } from './context/RestaurantContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </StrictMode>,
);
