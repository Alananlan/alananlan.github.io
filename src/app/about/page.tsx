'use client'
import React from "react";
import { useRouter } from 'next/navigation'
import avatar from '../../../public/avatar.png'
import Image from 'next/image'
import Header from "@/components/header";
import MediaQuery from 'react-responsive'
import about from "./about.json"
import Footer from "@/components/footer";


function Page() {   
    const Entry = (header: String, data: string[]) => {
        return (
            <div>
                <p className="font-bold">{header}</p>
                <ul>
                    {data.map(li => (
                        <li className="w-30">{li}</li>
                    ))}
                </ul>
                <br/>
            </div>
        )
    }

    const DesktopView = () => (
        <div>
            {/* First column */}
            <div className="flex flex-row flex-wrap">
                <div className="mt-10 ml-10">
                    <Image src={avatar} alt="avatar" width={300} height={300}/>
                </div>
                <div className="flex flex-col mx-10 mt-10 w-1/4 lg:text-xl md:text-md">
                    {Entry(about.intro.header, about.intro.list)}
                    {Entry(about.learn.header, about.learn.list)}
                    {Entry(about.goals.header, about.goals.list)}
                </div>

                {/* Second column */}
                <div className="flex flex-col w-1/4 mx-10 mt-10 lg:text-xl md:text-md">
                    {Entry(about.travel.header, about.travel.list)}
                    {Entry(about.hobbies.header, about.hobbies.list)}
                    {Entry(about.quote.header, about.quote.list)}
                    {Entry(about.message.header, about.message.list)}
                </div>
            </div>
        </div>
    )

    const MobileView = () => (
        <div>
            {/* First column */}
            <div className="flex flex-col items-center">
                <div className="mt-10">
                    <Image src={avatar} alt="avatar" width={200} height={200}/>
                </div>
                <div className="flex flex-col mx-10 mt-10 w-25 lg:text-xl md:text-md">
                    {Entry(about.intro.header, about.intro.list)}
                    {Entry(about.travel.header, about.travel.list)}
                    {Entry(about.learn.header, about.learn.list)}
                    {Entry(about.goals.header, about.goals.list)}
                    {Entry(about.hobbies.header, about.hobbies.list)}
                    {Entry(about.quote.header, about.quote.list)}
                    {Entry(about.message.header, about.message.list)}
                </div>
            </div>
        </div>
    )
    
    return (
        <div className="">
            <Header></Header>
            <MediaQuery maxWidth={998}>
                <MobileView></MobileView>
            </MediaQuery>
            {/* Desktop or laptop */}
            <MediaQuery minWidth={999}>
                <DesktopView></DesktopView>
            </MediaQuery>
            <Footer></Footer>
        </div>
    )
}

export default Page;