"use client"

import React, { useState, useEffect } from 'react'
import { clapCount } from '../../actions/Clap';
import axios from 'axios';
import { BookHeart } from 'lucide-react';

type Props = {
  storyId: string,
  clapCount: number,
  userClaps: number,
  commentId?: string,
}

const ClapComponent = ({ storyId, clapCount, commentId, userClaps }: Props) => {

  const [currentClaps, setCurrentClaps] = useState(clapCount)

  const [currentUserClaps, setCurrentUserClaps] = useState(userClaps)

  const [showPopup, setShowPopup] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowPopup(false)
    }, 1000)
  }, [showPopup])
  const clapStoryorComment = async () => {
    if (currentUserClaps >= 50) {
      setShowPopup(true)
      return

    }
    setCurrentUserClaps((prev) => prev + 1)
    setCurrentClaps((prev) => prev + 1)

    setShowPopup(true)

    try {
      if (!commentId) {
        await axios.post('/api/clap', { storyId })
      }
      else {
        await axios.post('/api/clapComment', {
          storyId,
          commentId
        })
      }
      console.log('success')

    } catch (error) {
      console.log("error")
      setCurrentClaps((prev) => prev - 1)
      setCurrentUserClaps((prev) => prev - 1)

    }
  }


  return (
    <button onClick={(e) => { e.preventDefault(); clapStoryorComment() }} className='flex items-center relative'>
      <span className={`absolute bottom-10 w-[40px] h-[40px] bg-black rounded-full shadow-2xl shadow-neutral-300 text-white flex items-center justify-center duration-75 ease-in ${showPopup ? "scale-100 basis-10 opacity-100 translate-y-0" : "scale-0 opacity-0 translate-y-8"}`}>
        {currentUserClaps}
      </span>
      {currentUserClaps > 0 ? (
        <BookHeart color="#3678ce" strokeWidth={1} width={20} />
      ) : (
        <BookHeart strokeWidth={1} className='opacity-60' width={20} />
      )}
      <p className='text-sm opacity-60'>{currentClaps}</p>
    </button>
  )
}

export default ClapComponent