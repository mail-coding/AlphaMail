import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@/shared/styles/tailwind.css';

async function main() {

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

main();