'use client'

import { useRouter } from 'next/navigation'
import seattle from '../../../public/photos/Seattle.png'

import Image from 'next/image'
import Header from '@/components/header';


export default function Page() {
    return (
        <div className="">
            <Header></Header>


            <div className="flex flex-row flex-wrap ml-10 mt-10 justify-center ">
                <p>Under construction!</p>
                    {/* <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10 hover:-translate-y-1 hover:scale-105 duration-300'/>
                    <Image src={seattle} alt="avatar" width={300} height={300} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={400} height={400} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10'/>

                    <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={300} height={300} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={400} height={400} className='mr-10 mt-10'/>

                    <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={300} height={300} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={600} height={600} className='mr-10 mt-10'/>
                    <Image src={seattle} alt="avatar" width={400} height={400} className='mr-10 mt-10'/> */}
            </div>
        </div>
    )
  }