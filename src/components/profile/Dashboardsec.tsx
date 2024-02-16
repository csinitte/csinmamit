"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { buttonVariants } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { RotateLoader } from 'react-spinners';
import { motion, useAnimation } from 'framer-motion';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import AnimatedGradientText from '../AnimatedGradientText';
import {  Highlights } from '../Highlights';
import Testimonials from '../testimonials';
// import { Magazine } from './Magazine';



const Dashboardsec= () => {
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();


  useEffect(() => {
    // Simulating loading delay (replace this with actual data fetching)
    const delay = setTimeout(() => {
      setLoading(false);
      controls.start({ opacity: 1, y: 0 });
    }, 2000);

    // Clear the timeout on component unmount
    return () => clearTimeout(delay);
  }, [controls]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotateLoader color="#2563eb" />
      </div>
    );
  }

  return (
    <>

      
      <MaxWidthWrapper>

      <AnimatedGradientText className='pb-4'>
        Highlights
      </AnimatedGradientText>
      <p className=" text-zinc-700 sm-text-l font-semibold text-center pb-5">We have successfully reached out many events. As we reflect back, here are some of the events organized by CSI!</p>
      <div className='w-3/4 mx-auto cursor-pointer overflow-hidden rounded-lg flex items-center justify-center flex-col'>
  <Highlights />
</div>

<Testimonials/>

{/* <AnimatedGradientText className='pb-4'>
        Magazine
      </AnimatedGradientText>
      <div className='w-3/4 mx-auto cursor-pointer overflow-hidden rounded-lg flex items-center justify-center flex-col'>
      <Magazine/>
</div> */}
      
      </MaxWidthWrapper>

    </>
  );
};

export default Dashboardsec;
