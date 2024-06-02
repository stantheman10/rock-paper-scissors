import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Rock Paper Scissors</h1>
      <Link to='/play-with-friend'>Play with a Friend</Link>
      <Link>Play with a Stranger</Link>
    </div>
  )
}

export default Home
