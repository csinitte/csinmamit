"use client";
import { useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from "react-spinners";
import Link from "next/link";
import AnimatedGradientText from "@/components/AnimatedGradientText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import eventData from "@/lib/eventdata.json";
import { eventTabs } from "@/lib/utils";
import { Events2024 } from "@/lib/constants";
interface EventData {
  [key: string]: { event_name: string; img: string }[];
}

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <RotateLoader color="#2563eb" />
  </div>
);

interface EventProps {
  eventName: string;
  imageSrc: string;
}

interface TempProps {
  date: string;
}

const TeamMember: React.FC<EventProps> = ({ eventName, imageSrc }) => {
  return (
    <div className="rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl  hover:ring-blue-500 transition-all">
      <div className="flex justify-center items-center ">
        <div className="relative w-76 h-80 overflow-hidden rounded-md">
          <Image
            src={imageSrc}
            width={350}
            height={350}
            objectFit="cover"
            alt="main-image"
            quality={100}
            className="w-350px h-350px hover:cursor-pointer"
          />
        </div>
      </div>
      <div className="text-center pt-6 pb-6">
        <h2 className="text-xl font-bold">{eventName}</h2>
      </div>
    </div>
  );
};

const Temp2024 = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  return (
    <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
      <div className="mt-10 pb-10 flex flex-wrap gap-10 justify-center">
        {Events2024.map((event, index) => (
          <TeamMember key={index} {...event} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default Temp2024;
