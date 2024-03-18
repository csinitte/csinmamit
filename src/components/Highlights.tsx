import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";


const imgList = ['/eve/eve (10).heic', '/eve/eve (11).heic', '/eve/eve (12).heic', '/eve/eve (13).heic', '/eve/eve (14).heic', '/eve/eve (15).heic', '/eve/eve (16).heic', '/eve/eve (17).heic', '/eve/eve (18).heic', '/eve/eve (19).heic', '/eve/eve (2).heic', '/eve/eve (20).heic', '/eve/eve (21).heic', '/eve/eve (22).heic', '/eve/eve (23).heic', '/eve/eve (24).heic', '/eve/eve (25).heic', '/eve/eve (3).heic', '/eve/eve (4).heic', '/eve/eve (5).heic', '/eve/eve (6).heic', '/eve/eve (7).heic', '/eve/eve (8).heic', '/eve/eve (9).heic'];

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
