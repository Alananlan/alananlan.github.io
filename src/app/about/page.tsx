'use client'
import React from "react";
import { useRouter } from 'next/navigation'
import avatar from '../../../public/avatar.png'
import Image from 'next/image'
import Header from "@/components/header";

function Page() {    
    return (
        <div className="">
            <Header></Header>

            {/* First column */}
            <div className="flex flex-row flex-wrap">
                <div className="mt-10 ml-10">
                    <Image src={avatar} alt="avatar" width={300} height={300}/>
                </div>
                <div className="flex flex-col mx-10 mt-10 w-1/4 lg:text-xl md:text-md">
                    <p className="font-bold">Hello, my name is Alan.</p>
                    <p>I'm 19, and I'm an aspiring software engineer based in Seattle, Washington.</p>
                    <p>I'm currently learning about distributed systems, databases, and AI.</p>
                    <br/>
                    <p className="font-bold">I want to learn more about:</p>
                    <ul>
                        <li>Cybersecurity and encryption</li>
                        <li>Operating systems and compilers</li>
                        <li>World languages, Korean, Japanese, Spanish</li>
                    </ul>
                    <br/>
                    <p className="font-bold">Here are my current goals:</p>
                    <ul>
                        <li>I want to land an internship this year.</li>
                        <li>I want to become lean by summer.</li>
                        <li>I want to run a 6:00 mile.</li>
                    </ul>
                    <br/>
                    <p className="font-bold">My favorite quote:</p>
                    <p>Luck is when preparation meets opportunity.</p>
                    <br/>
                    
                </div>

                {/* Second column */}
                <div className="flex flex-col w-1/4 mx-10 mt-10 lg:text-xl md:text-md">
                    <p className="font-bold">Where I want to travel:</p>
                    <ul>
                        <li>NYC, USA</li>
                        <li>San Francisco, USA</li>
                        <li>Tokyo, Japan</li>
                        <li>Seoul, South Korea</li>
                        <li>Blue Lagoon, Iceland</li>
                        <li>Maldives Islands</li>
                    </ul>
                    <br/>
                    <p className="font-bold">Some of my hobbies include:</p>
                    <ul>
                        <li>Tennis</li>
                        <li>Swimming</li>
                        <li>Gaming (Plat II in Val, Rank 8 Faceit)</li>
                    </ul>
                    <br/>
                    <p className="font-bold">My personal message:</p>
                    <p>Carpe futurum. Seize the future.</p>
                    <br/>
                </div>
            </div>
        </div>
    );
}

export default Page;