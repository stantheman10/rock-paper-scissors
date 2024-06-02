import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col justify-start space-y-[320px] md:space-y-32 h-screen items-center">
      <h1 className="font-medium pt-20 text-2xl">Rock Paper Scissors</h1>
      <div className="flex flex-col space-y-14 text-xl justify-center items-center">
        <Link to="/play-with-friend" className="bg-black text-white p-4 rounded-lg" >Play with a Friend</Link>
        <Link to="/play-with-stranger" className="bg-black text-white p-4 rounded-lg">Play with a Stranger</Link>
      </div>
    </div>
  );
};

export default Home;
