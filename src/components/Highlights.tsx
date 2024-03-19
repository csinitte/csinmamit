import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";


const imgList = ['/eve/evee (1).jpg', '/eve/evee (10).jpg', '/eve/evee (11).jpg', '/eve/evee (12).jpg', '/eve/evee (13).jpg', '/eve/evee (14).jpg', '/eve/evee (2).jpg', '/eve/evee (3).jpg', '/eve/evee (4).jpg', '/eve/evee (5).jpg', '/eve/evee (6).jpg', '/eve/evee (7).jpg', '/eve/evee (8).jpg', '/eve/evee (9).jpg']
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
