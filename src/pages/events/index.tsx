"use client";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { RotateLoader } from "react-spinners";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import EventsList from "~/components/events/EventsList";
import localFont from "next/font/local";
const myFont = localFont({ src: "../../pages/obscura.otf" });

const Events = () => {
  const [loading, setLoading] = useState(true);

  return (
    <MaxWidthWrapper className="mb-12 mt-6 sm:mt-9 lg:mt-12 flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <>
          <div className="mt-6 sm:mt-10 mb-6 sm:mb-10">
          <h1
            className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-6 sm:pt-10 text-center text-3xl sm:text-4xl lg:text-6xl font-black text-transparent underline-offset-2 `}
          >
            Events
          </h1>
            <p className="mt-3 sm:mt-5 max-w-prose text-zinc-700 text-sm sm:text-base lg:text-lg font-semibold px-4">
              We have successfully reached out many events. As we reflect back,
              here are some of the events organized by CSI!
            </p>
          </div>
          <Tabs defaultValue="2023" className="w-full max-w-6xl">
            <TabsList className="flex flex-wrap h-auto p-1 gap-1 sm:gap-2">
              <TabsTrigger value="2019" className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">2019-20</TabsTrigger>
              <TabsTrigger value="2020" className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">2020-21</TabsTrigger>
              <TabsTrigger value="2021" className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">2021-22</TabsTrigger>
              <TabsTrigger value="2022" className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">2022-23</TabsTrigger>
              <TabsTrigger value="2023" className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">2023-24</TabsTrigger>
            </TabsList>
            <TabsContent value="2019">
              <EventsList date="2019" />
            </TabsContent>
            <TabsContent value="2020">
              <EventsList date="2020" />
            </TabsContent>
            <TabsContent value="2021">
              <EventsList date="2021" />
            </TabsContent>
            <TabsContent value="2022">
              <EventsList date="2022" />
            </TabsContent>
            <TabsContent value="2023">
              <EventsList date="2023" />
            </TabsContent>
          </Tabs>
        </>
    
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
  background-image: -webkit-linear-gradient(
    92deg,
    #8a2be2,
    #ff69b4
  ); /* Dark Blue to Pink */
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
