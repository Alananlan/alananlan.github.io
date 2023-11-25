'use client'


import { useEffect } from 'react'
import Landing from './landing/page'
// import Scrollbar from 'smooth-scrollbar';

export default function Home() {
  const overscrollOptions = {
    enable: true,
    effect: 'bounce',
    damping: 0.15,
    maxOverscroll: 150,
    glowColor: '#fff',
  };
const options = {
  damping : 0.07,
  plugins: {
    overscroll: { ...overscrollOptions },
  },
  
}

  useEffect(() => {
    // Scrollbar.initAll();
  })

  return (
    <div className=''>
      <Landing></Landing>
    </div>
  )
}
