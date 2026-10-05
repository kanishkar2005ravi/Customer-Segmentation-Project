import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MallApp } from './pages/MallApp';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MallApp />} />
        <Route path="/mall" element={<MallApp />} />
        <Route path="*" element={<MallApp />} />
      </Routes>
    </Router>
  );
};

export default App;
