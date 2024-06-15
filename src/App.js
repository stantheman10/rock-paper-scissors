import React, { useState } from "react";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PlayWithFriend from "./pages/PlayWithFriend";
import Home from "./pages/Home";
import PlayWithStranger from "./pages/PlayWithStranger";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/"
          element={<Home />}
        />
        <Route path="/play-with-friend"
          element={<PlayWithFriend />}
        />
        <Route 
            path="/play-with-stranger"
            element={<PlayWithStranger />}
        />
        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
