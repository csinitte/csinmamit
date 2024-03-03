import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import 'react-awesome-slider/dist/styles.css';
import eventData from '@/lib/eventdata.json';
import AwesomeSlider from "react-awesome-slider";

const imgList = Object.values(eventData).flatMap((yearEvents) =>
  yearEvents.map((event) => event.img)
);

export const Highlights = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (

    <AwesomeSlider className="pb-10">
              {imgList.map((imageUrl, index) => (
                    <div
                    data-src={imageUrl}
                    key={index}
                    
                />
        ))}
  </AwesomeSlider>
  )
}
