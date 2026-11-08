import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Admin from './Admin.tsx';
import { getEventType } from './events';
import './index.css';

const path = window.location.pathname;

if (path !== '/admin') {
  document.documentElement.dataset.event = getEventType(new URLSearchParams(window.location.search).get('t'));
}

createRoot(document.getElementById('root')!).render(
  path === '/admin' ? <Admin /> : <App />
);
