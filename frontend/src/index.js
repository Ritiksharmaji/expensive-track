import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalProvider } from './context/globalContext';
import { GlobalStyle } from './styles/GlobalStyle';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Use GlobalStyle as a self-closing tag */}
    <GlobalStyle /> 
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
