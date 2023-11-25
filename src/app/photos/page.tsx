'use client'

import { useState } from 'react';
import Header from '@/components/header';
import Imgix from "react-imgix";
import Image from 'next/image';
import { Lightbox } from "react-modal-image";
import "../global.css"
import Footer from '@/components/footer';


export default function Page() {
  

  // State to manage modal visibility and selected image
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  // Array of image names
  // TODO: Change array of image names to JSON items
  // TODO: Change to state instead of const
  const images = ['IMG_1652.JPG', 'IMG_1695.JPG', 'IMG_1756.JPG', 'IMG_1890.JPG', 'IMG_4917.JPG', 'IMG_4944.JPG', 'IMG_9307.JPG', 'IMG_9312.JPG', 'IMG_9320.JPG', 'IMG_9377.JPG', 'IMG_9379.JPG', 'IMG_9472.JPG', 'IMG_9504.JPG', 'IMG_9533.JPG', 'IMG_9561.JPG', 'IMG_9572.JPG', 'IMG_9588.JPG', 'IMG_9664.JPG', 'IMG_9672.JPG', 'IMG_9707.JPG']
      
  // Builds the string url by appending a string suffix to URL
  const buildURL = (imagePath: string) => `https://srirachandrice.imgix.net/${imagePath}`

  // Function to handle image click and open modal
  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
    setModalOpen(true);
  }

  // Function to close modal
  const closeModal = () => {
    setSelectedImage('');
    setModalOpen(false);
  }

  // Modify Gallery component to include onClick handler
  interface GalleryProps {
    handleImageClick: (imagePath: string) => void;
  }

  // Gallery render component, maps images from array
  const Gallery: React.FC<GalleryProps> = ({ handleImageClick }) => (
    <div className="gallery mb-10">
      {images.map((image, index) => (
        <div className="mt-5 mx-0 bg-blue-500 w-60 mx-5" key={index} onClick={() => handleImageClick(buildURL(image))}>
          <div className="box-border h-80 w-60 content-center shadow-lg bg-white hover:-translate-y-1 hover:scale-105 duration-300">
            <div className="pl-5 pt-5">
              <Imgix
                sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw"
                src={buildURL(image)}
                imgixParams={{
                  fit: 'crop',
                  fm: 'jpg',
                }}
                width={200}
                height={200}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="">
      {/* Header */}
      <Header />

      {/* Modal toggle state */}
      {modalOpen && <Lightbox
        small={selectedImage}
        medium={selectedImage}
        hideDownload={true}
        hideZoom={true}
        imageBackgroundColor={"black"}
        onClose={closeModal}
      />}

      {/* Gallery */}
      <Gallery handleImageClick={handleImageClick} />

      <Footer></Footer>
    </div>
  );
}
