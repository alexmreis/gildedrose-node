import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BrowserSound } from './browser-sound';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App sound={new BrowserSound()} />
  </StrictMode>,
);
