import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";


const imgList = ['/assets/events/Alankar.jpg', '/assets/events/android_cover.jpeg', '/assets/events/android_webinar.jpg', '/assets/events/animate.jpg', '/assets/events/animix.png', '/assets/events/arcs.png', '/assets/events/bytebrawl.png', '/assets/events/careerconnect.png', '/assets/events/cloud.jpg', '/assets/events/codathon.jpg', '/assets/events/coding blackout.png', '/assets/events/csii.jpeg', '/assets/events/datadive.png', '/assets/events/de.png', '/assets/events/debug.png', '/assets/events/e1.jpeg', '/assets/events/e2.jpeg', '/assets/events/e3.jpeg', '/assets/events/e4.jpeg', '/assets/events/e5.jpeg', '/assets/events/e6.jpeg', '/assets/events/ergonomics_cover.jpg', '/assets/events/genmeet.png', '/assets/events/gtl.png', '/assets/events/inauguration_cover.jpeg', '/assets/events/inquiz_cover.jpeg', '/assets/events/IOT.jpg', '/assets/events/kahani.jpg', '/assets/events/lipsync.jpg', '/assets/events/locklogo_cover.jpeg', '/assets/events/main.py', '/assets/events/memepathi.jpg', '/assets/events/memory.jpeg', '/assets/events/minute.jpg', '/assets/events/ML.jpg', '/assets/events/ml.png', '/assets/events/onlineodyssey.png', '/assets/events/pandamic_trough_you_eyes.jpg', '/assets/events/pp.png', '/assets/events/product.png', '/assets/events/quadx.jpg', '/assets/events/quizdom.jpg', '/assets/events/r_programming.jpg', '/assets/events/salesforce.png', '/assets/events/vantage.jpg', '/assets/events/webdev.jpg', '/assets/events/webpiracy.jpg', '/assets/events/web_cover.jpeg'];


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
