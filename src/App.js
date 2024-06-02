import React, { useState } from "react";
import io from "socket.io-client";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PlayWithFriend from "./pages/PlayWithFriend";
import Home from "./pages/Home";



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
        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
