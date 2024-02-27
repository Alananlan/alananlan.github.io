'use client'

// TODO: Do not use image imports
import Header from '../../components/header'
import DocApp from '../../../public/photos/DocApp.png'
import BeTogether from '../../../public/photos/BeTogether.png'
import Flightapp from '../../../public/photos/Flightapp.png'
import MangTracker from '../../../public/photos/MangTracker.png'
import Image, { StaticImageData } from 'next/image'
import { useState } from 'react'
import React from 'react'
import MediaQuery from 'react-responsive'
import Footer from '@/components/footer'
import Projects from './projects.json'

// Project item interface
// TODO: Make into separate JSON file
export interface Project {
    name: string
    desc: string
    img: StaticImageData
    link: string
}

// TODO: Modularize project items into JSON, extract JSON elements
export default function Page() {
    const temp = ["DocApp is a project created during DubHacks 2023, a hackathon at the University of Washington. It aims to create a web application that connects patients to their doctors. Doctors can prescribe patient ailments/medical conditions and patients are able to ask GPT-4 common questions about the issue.", 
    "Javascript-based React Native front end application for iOS and Android. We implemented technologies such as Neo4j (graph database), Key-Value Database AWS S3, and React.js.",
    "Flightapp is a Java program that interacts with an Azure SQL database using JDBC (Java Database Connectivity) for retrieval, modification, and storage. It uses a secure create and login system with password salting and hashing, ensuring the protection of sensitive data. The app has a reservation functionality, enabling users to reserver itineraries and manage their bookings.",
    "Mangtracker is a web application that lets users keep track of their favorite manga or manwha (Japanese/Korean) reads. It uses TypeScript, React, and Tailwind to create a responsive user interface. It fetches and displays relevant data about a series, including manga/manwha details, chapters, and release dates, providing up-to-date information to users."]
    const [selectedProject, setSelectedProject] = useState(0)
    const [projects, addProject] = useState<Project[]>([
        {name: "DocApp", desc: temp[0], img:DocApp, link: "https://docapp-inky.vercel.app/"},
        {name: "BeTogether", desc: temp[1], img:BeTogether, link: ""},
        {name: "FlightApp", desc: temp[2], img:Flightapp, link: ""},
        {name: "MangTracker", desc: temp[3], img:MangTracker, link: ""},
    ])

    const [jsonProjects, addJsonProject] = useState(
        [Projects]
    )

    console.log(jsonProjects)
    
    // Project selection handler
    const handleSelection = (id: number) => {
        if (id === selectedProject) {
            setSelectedProject(0)
        } else {
            console.log(id)
            setSelectedProject(id)
        }
    }

    // Project image click handler (redirect)
    const handleProjectImageClick = (link: string) => {
        if (link === "") {
            console.log("No link")
        } else {
            console.log("clicked")
            window.open(link)
        }
    }

    // Mobile view render
    const MobileView = () => (
        <div className="flex flex-row flex-wrap">
            <div className="flex flex-col mt-0 w-full text-center lg:text-xl md:text-md">
                {/* <p className='font-bold'>Here are some of my projects:</p> */}
                <ul className=''>
                    {projects.map((project, index) => (
                    <li className='my-10 font-medium text-black-500 ' key={index}>
                        <button onClick={() => handleSelection(index)} className='hover:-translate-y-1 hover:scale-105 duration-300'>
                            {project.name}                                    
                        </button>
                        {/* <hr className="w-48 h-1 mx-auto my-2 bg-gray-100 border-0 rounded dark:bg-gray-500"/> */}
                        {selectedProject == index ?
                            <div>
                            <Image 
                            src={projects[selectedProject].img} 
                            alt={"seattle"} 
                            onClick={() => handleProjectImageClick(projects[selectedProject].link)} 
                            className='w-full hover:opacity-80'
                            height={200}/>
                            <p className='my-5 mx-10 text-left'>{projects[selectedProject].desc}</p>
                            </div>
                            : <></>
                            }
                    </li>))}
                </ul>
            </div>
        </div>
    )

    // Desktop view render
    const DesktopView = () => (
        <div className='flex flex-col justify-between'>

        <div className="flex flex-row flex-wrap">
            {/* First column */}
            <div className="flex flex-col mt-10 w-1/4 ml-10 lg:text-xl md:text-md">
                <p className='font-bold'>Here are some of my projects:</p>

                {/* <ul>
                    {projects.map((project, index) => (
                    <li className='my-10 font-medium text-black-500 hover:-translate-y-1 hover:scale-105 duration-300' key={index}>
                        <button onClick={() => handleSelection(index)}>
                            {project.name}
                        </button>
                    </li>
                    ))}
                </ul> */}
                <ul>
                    
                </ul>
            </div>

            {/* Second column */}
            <div className="bg-fixed w-1/2 mt-10 mx-10 lg:text-xl md:text-md sm:text-md">
                {/* <Image 
                    src={projects[selectedProject].img} 
                    alt={"seattle"} 
                    onClick={() => handleProjectImageClick(projects[selectedProject].link)} 
                    className='hover:-translate-y-1 hover:scale-105 duration-300 hover:opacity-80'
                    height={100}/> */}
                <p className='font-bold lg:text-8xl md:text-6xl sm:text-4xl'>{projects[selectedProject].name}</p>
                <p className='my-5'>{projects[selectedProject].desc}</p>
            </div>
        </div>
        </div>

    )

    return (
        <div>
            {/* Header */}
            <Header></Header>

            {/* Mobile view */}
            <MediaQuery maxWidth={767}>
                <MobileView></MobileView>
            </MediaQuery>

            {/* Desktop or laptop */}
            <MediaQuery minWidth={768}>
                <DesktopView></DesktopView>
            </MediaQuery>

            <Footer></Footer>
            
        </div>
    )
  }