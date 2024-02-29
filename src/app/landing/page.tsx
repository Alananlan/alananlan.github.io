"use client";

import Header from "../../components/header";
import avatar from "../../../public/avatar.png";
import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import React from "react";
import MediaQuery from "react-responsive";
import Footer from "@/components/footer";
import Projects from "../../../public/projects.json";
import About from "../../../public/about.json"

export default function Page() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [jsonProjects] = useState(Projects);

  // Project selection handler
  const handleSelection = (id: number) => {
    if (id === selectedProject) {
      setSelectedProject(null);
    } else if (id) {
      setSelectedProject(id);
    }
  };

	const handleButtonClick = (link: string) => {
    
  };

  /**
	 * The media view for mobile users.
	 * @returns The mobile media view used within a MediaQuery component.
	 */
  const MobileView = () => (
    <div className="flex flex-row flex-wrap">
      <div className="flex flex-col mt-0 w-full text-center lg:text-xl md:text-md">
        <p className='font-bold'>Here are some of my projects:</p>
        <ul className="">
          {jsonProjects.map((project, index) => (
            <li className="my-10 font-medium text-black-500 " key={index}>
              <button
                onClick={() => handleSelection(index)}
                className="hover:-translate-y-1 hover:scale-105 duration-300"
              >
                {project.name}
              </button>
              {selectedProject == index ? (
                <div>
                  <p className="my-5 mx-10 text-left">
                    {jsonProjects[selectedProject].description}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  /**
	 * The media view for desktop users.
	 * @returns The desktop media view used within a MediaQuery component.
	 */
  const DesktopView = () => (
    <div className="flex justify-center flex-row flex-wrap">
      <div className="flex flex-col w-1/3 mt-10 mx-10 lg:text-xl md:text-md sm:text-md">
        <div className="flex flex-row mt-10">
					<div className="hover:scale-110 hover:-translate-y-1 hover:rotate-12 duration-300">
          	<Image src={avatar} alt="avatar" width={300} height={300} />
					</div>
          <div className="flex flex-col ml-5">
            <p className="font-bold">{About[0].header}</p>
						<hr />
            <ul>
              {About[0].list.map((item, index) => (
                <li>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="my-5">Here are some of my projects:</p>
        <ul>
          {jsonProjects.map((project, index) => (
            <div>
              <a className="font-bold lg:text-4xl md:text-4xl sm:text-2xl hover:underline duration-300 "
							href={project.link}
							target="blank"
							>
                {project.name}
              </a>
							<hr className="mt-2"/>
              <p className="my-5">{project.description}</p>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div>
      <Header></Header>
      <MediaQuery maxWidth={767}>
        <MobileView></MobileView>
      </MediaQuery>
      <MediaQuery minWidth={768}>
        <DesktopView></DesktopView>
      </MediaQuery>
      <Footer></Footer>
    </div>
  );
}
