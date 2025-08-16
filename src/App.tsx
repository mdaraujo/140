import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import Home from './pages/Home';

const App: React.FC = () => {
  const base = import.meta.env.VITE_BASE_PATH || '/';
  return (
    <AppProviders>
      <BrowserRouter basename={base}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
};

export default App;
