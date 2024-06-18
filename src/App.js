import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlayWithStranger from './pages/PlayWithStranger';
import Winner from './pages/Winner';
import Home from './pages/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/play-with-stranger" element={<PlayWithStranger />} />
        <Route path="/winner" element={<Winner />} />
      </Routes>
    </Router>
  );
};

export default App;
