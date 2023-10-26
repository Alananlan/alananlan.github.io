'use client'

import Header from '@/components/header';

export default function Page() {
    return (
        <div>
            <Header></Header>

            <div className="flex flex-col mt-10 w-1/4 lg:text-xl md:text-md">
                    <p className='font-bold ml-10'>Here are my contacts:</p>
                    <ul className='ml-10'>
                       <li>Instagram</li>
                       <li>LinkedIn</li>
                       <li>GitHub</li>
                    </ul>
                </div>
        </div>
    )
  }