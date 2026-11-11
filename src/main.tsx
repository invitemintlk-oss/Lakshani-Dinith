import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Admin from './Admin.tsx';
import { detectEventType } from './events';
import './index.css';

const path = window.location.pathname;

if (path !== '/admin') {
  document.documentElement.dataset.event = detectEventType();
}

createRoot(document.getElementById('root')!).render(
  path === '/admin' ? <Admin /> : <App />
);
