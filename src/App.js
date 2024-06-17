import React from "react";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PlayWithFriend from "./pages/PlayWithFriend";
import Home from "./pages/Home";
import PlayWithStranger from "./pages/PlayWithStranger";
import Winner from "./pages/Winner";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/"
          element={<Home />}
        />
        <Route path="/play-with-friend/:roomId"
          element={<PlayWithFriend />}
        />
        <Route 
            path="/play-with-stranger"
            element={<PlayWithStranger />}
        />
        <Route
            path="/check-winner"
            element={<Winner />}  
        />
        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
