import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";


const imgList = ['/eve/event (1).jpg', '/eve/event (2).jpg', '/eve/event (3).jpg', '/eve/event (4).jpg', '/eve/event (5).jpg', '/eve/event (6).jpg', '/eve/event (7).jpg', '/eve/event (8).jpg', '/eve/event (9).jpg'];

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
