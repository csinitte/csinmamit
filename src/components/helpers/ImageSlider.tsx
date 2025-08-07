import * as React from "react";
import Image from "next/image";
import "react-awesome-slider/dist/styles.css";
import AwesomeSlider from "react-awesome-slider";

const imgList = [
  "/highlights/event (1).jpg",
  "/highlights/event (2).jpg",
  "/highlights/event (3).jpg",
  "/highlights/event (4).jpg",
  "/highlights/event (5).jpg",
  "/highlights/event (6).jpg",
  "/highlights/event (7).jpg",
  "/highlights/event (8).jpg",
  "/highlights/event (9).jpg",
];

export const ImageSlider = () => {
  return (
    <AwesomeSlider className="pb-10">
      {imgList.map((imageUrl, index) => (
        <div key={index} data-src={imageUrl}>
          <Image 
            src={imageUrl} 
            alt="Image" 
            width={300} 
            height={200} 
            style={{ width: 'auto', height: 'auto' }}
            className="object-cover"
          />
        </div>
      ))}
    </AwesomeSlider>
  );
};
