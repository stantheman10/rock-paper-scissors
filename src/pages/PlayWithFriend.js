import React from 'react'
import io from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const PlayWithFriend = () => {
  return (
    <div className='flex flex-col h-screen'>
      <h1 className='text-center'>Play With Your Friend</h1>
      <div className='flex h-full'>
        <div className='w-1/2 bg-blue-500 text-center h-full border-r border-black flex flex-col items-center justify-start space-y-12'>
          <h2>Your side</h2>
          <FontAwesomeIcon icon="fa-solid fa-hand-back-fist" />
        <div className='flex  items-center justify-center space-x-4 h-64 w-64 bg-gray-200'>
          <span>Rock</span>
          <span>Paper</span>
          <span>Scissors</span>
          
        </div>
        
        </div>
        <div className='w-1/2 bg-green-500 text-center h-full flex flex-col items-center justify-start space-y-12'>opponent side</div>
      </div>
    </div>
  )
}

export default PlayWithFriend
