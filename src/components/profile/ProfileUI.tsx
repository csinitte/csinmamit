"use client";
import { useState, useEffect } from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, Linkedin, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from "react-spinners";
import Link from "next/link";
import AnimatedGradientTexth2, {
  AnimatedGradientTexth3,
} from "@/components/AnimatedGradientText";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import eventData from "@/lib/eventdata.json";
import { eventTabs } from "@/lib/utils";

interface EventData {
  [key: string]: { event_name: string; img: string }[];
}

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <RotateLoader color="#2563eb" />
  </div>
);

interface ProfileProps {
  data: TabsProps;
}

interface TabsProps {
  name: string;
  username: string;
  pfp: string;
  bio: string;
  branch: string;
  github: string;
  linkedin: string;
  role: string;
  usn: string;
}

const ProfileUI: React.FC<ProfileProps> = ({ data }) => {
  return (
    <>
      <div className="relative w-80 h-80 overflow-hidden rounded-mx mx-auto pt-5 ">
        <Image
          src={data.pfp.replace("=s96-c", "")}
          width={300} // Adjust the width as needed
          height={300} // Adjust the height as needed
          alt="main-image"
          quality={100}
          className="object-cover w-full h-full rounded-md hover:border-cyan-300"
        />
      </div>
      <div className="pt-3">
        <AnimatedGradientTexth2>{data.name}</AnimatedGradientTexth2>
      </div>
      <div>
        <AnimatedGradientTexth3>@{data.username}</AnimatedGradientTexth3>
      </div>

      <h4>
        <span className="font-bold text-slate-400">Bio : </span>
        {data.bio}
      </h4>
      <h4>
        <span className="font-bold text-slate-400">Role: </span>
        {data.role}
      </h4>
      <h4>
        <span className="font-bold text-slate-400">USN: </span>
        {data.usn}
      </h4>
      <div className="flex justify-center gap-4 mt-4">
        <Link
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className: "rounded-full transition-colors hover:text-blue-500",
          })}
          href={data.linkedin}
          target="_blank"
        >
          <LinkedinIcon size={24} />
        </Link>
        <Link
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className: "rounded-full  transition-colors hover:text-gray-600",
          })}
          href={data.github}
          target="_blank"
        >
          <GithubIcon size={24} />
        </Link>
      </div>
    </>
  );
};

export default ProfileUI;
