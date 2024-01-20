"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
import Link from 'next/link';
import AnimatedGradientText from '@/components/AnimatedGradientText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import eventData from '@/lib/eventdata.json';
import { eventTabs } from '@/lib/utils';
interface EventData {
    [key: string]: { event_name: string; img: string }[];
  }
  
  // Loader component
  const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <RotateLoader color="#2563eb" />
    </div>
  );
  
  
  
  const Certificates = () => {

  
    return (
      <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
        <AnimatedGradientText>
          Certificates
        </AnimatedGradientText>

        No certificates yet. Participate in events to get certificates.
      </MaxWidthWrapper>
    );
  };
  
  export default Certificates;
  