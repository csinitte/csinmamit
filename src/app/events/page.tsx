"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import styled, { keyframes } from "styled-components";
import { RotateLoader } from 'react-spinners';

const Events = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // Simulate an API request delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
      {loading ? (
        <Loader />
      ) : (
        <div className='mt-10 mb-10'>
          <AnimatedGradientText>Events</AnimatedGradientText>
          <p className="mt-5 max-w-prose text-zinc-700 sm-text-l font-semibold ">We have successfully reached out many events. As we reflect back, here are some of the events organized by CSI!</p>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Events;

const hue = keyframes`
  from {
    filter: hue-rotate(240deg); /* Dark Blue */
  }
  to {
    filter: hue-rotate(-60deg); /* Pink */
  }
`;

const AnimatedGradientText = styled.h1`
  color: #8a2be2; /* Dark Blue */
  background-image: -webkit-linear-gradient(92deg, #8a2be2, #ff69b4); /* Dark Blue to Pink */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-animation: ${hue} 10s infinite linear;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-feature-settings: "kern";
  font-size: 48px;
  font-weight: 700;
  line-height: 48px;
  overflow-wrap: break-word;
  text-align: center;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
`;

const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <RotateLoader color="#8a2be2" />
  </div>
);
