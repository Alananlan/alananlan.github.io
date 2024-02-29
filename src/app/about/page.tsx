"use client";
import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import MediaQuery from "react-responsive";
import About from "../../../public/about.json";
import Footer from "@/components/footer";
import Potato from "../../../public/photos/Potato.jpeg";
import Pointing from "../../../public/photos/Pointing.jpeg";
import Gum from "../../../public/photos/Gum.jpeg";

function Page() {
  const DesktopView = () => (
    <div className="flex justify-center">
      <div className="flex flex-col w-1/3">
        <div className="flex flex-row mt-10 justify-center">
          <Image
            src={Potato}
            alt="Alan holding a potato tornado snack"
            height={300}
            className="hover:scale-110 hover:-translate-y-1 hover:rotate-12 duration-300"
          />
          <Image
            src={Pointing}
            alt="Alan pointing towards the ocean"
            height={300}
            className="ml-5 hover:scale-110 hover:-translate-y-1 hover:rotate-12 duration-300"
          />
          <Image
            src={Gum}
            alt="Alan at the Gum Wall"
            height={300}
            className="ml-5 hover:scale-110 hover:-translate-y-1 hover:rotate-12 duration-300"
          />
        </div>
        <ul>
          {About.map((info, index) => (
            <li className="my-5" key={index}>
              <div className="font-bold text-3xl">{info.header}</div>
              <hr />
              {info.list.map((item, innerindex) => (
                <p className="text-xl" key={innerindex}>{item}</p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const MobileView = () => (
    <div className="flex justify-center">
      <div className="flex flex-col px-5">
        <div className="flex flex-row mt-10 justify-center">
          <Image
            src={Potato}
            alt="Alan holding a potato tornado snack"
            height={150}
          />
          <Image
            src={Pointing}
            alt="Alan pointing towards the ocean"
            height={150}
            className="ml-5"
          />
          <Image
            src={Gum}
            alt="Alan at the Gum Wall"
            height={150}
            className="ml-5"
          />
        </div>
        <ul>
          {About.map((info, index) => (
            <li className="my-5" key={index}>
              <div className="font-bold text-2xl">{info.header}</div>
              {info.list.map((item, innerindex) => (
                <p className="text-xl" key={innerindex}>{item}</p>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="">
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

export default Page;
