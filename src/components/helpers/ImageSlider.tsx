import * as React from "react";
import AwesomeSlider from "react-awesome-slider";
import "react-awesome-slider/dist/styles.css";

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
    <AwesomeSlider
      className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-xl shadow-lg"
      bullets={true}
      organicArrows={true}
    >
      {imgList.map((imageUrl, index) => (
        <div key={index} data-src={imageUrl} />
      ))}
    </AwesomeSlider>
  );
};
