import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
import Link from 'next/link';
import AnimatedGradientText from '@/components/AnimatedGradientText';
import { trpc } from '@/app/_trpc/client';

interface EventData {
    [key: string]: { event_name: string; img: string }[];
  }
  
  // Loader component
  const Loader = () => (
    <div className="flex items-center justify-center h-screen">
      <RotateLoader color="#2563eb" />
    </div>
  );

  interface ProfProps {

  }

  
  
  const Certificates: React.FC<ProfProps> = () => {

    
    const { data: userData, error } = trpc.getCertificate.useQuery();

    useEffect(() => {
      // Fetch certificates data here
    }, []);

    if (!userData) {
      return <Loader />;
    }

    return (
      <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
        <AnimatedGradientText>
          Certificates
        </AnimatedGradientText>

        {Object.keys(userData as Record<string, any>).map((category: string, index: number) => (
  <div key={index} className="my-8">
    <h2 className="text-2xl font-semibold mb-4">{category}</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.isArray((userData as Record<string, any>)[category]) && (userData as Record<string, any>)[category].map((certificate: { event_name: string; img: string }, i: number) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
          <Image src={certificate.img} alt={certificate.event_name} width={300} height={200} />
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">{certificate.event_name}</h3>
            {/* Add additional details or buttons if needed */}
          </div>
        </div>
      ))}
    </div>
  </div>
))}


      </MaxWidthWrapper>
    );
  };
  
  export default Certificates;
