import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";

const imgList = Object.values(eventData).flatMap((yearEvents) =>
  yearEvents.map((event) => event.img) 
);

export const Highlights = () => {
  return (
    <AwesomeSlider className="pb-10">
      {imgList.map((imageUrl, index) => (
        <div key={index} data-src={imageUrl}>
          <Image src={imageUrl} alt="Image" width={300} height={200} />
        </div>
      ))}
    </AwesomeSlider>
  );
};
