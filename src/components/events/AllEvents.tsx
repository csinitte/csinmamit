"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
import Link from 'next/link';
import AnimatedGradientText, { AnimatedGradientTexth2 } from '@/components/AnimatedGradientText';
import { FacultyList } from '@/lib/constants';
import { trpc } from '@/app/_trpc/client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"


function formatDate(inputDate:Date) {
  // Convert string to date object

  let date = new Date(inputDate);

  // Extract day, month, and year
  let day = date.getUTCDate();
  let month = date.getUTCMonth() + 1; // Month starts from 0
  let year = date.getUTCFullYear();
  let formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
}

// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    {/* You can customize the loader's appearance here */}
    
    <RotateLoader color="#2563eb" />
  </div>
);

interface EventProps {
  eventname: string;
  category: string;
  date: Date;
  registered: string;
  organizers: string;
  description: string;
  imageLink: string;
}



const EventCard: React.FC<EventProps> = ({ eventname, category, date, registered, organizers, description, imageLink }) => {
  return (
    <div className="rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl hover:ring-blue-500 transition-all">
      <div className="flex justify-center items-center">
        <div className="relative w-76 h-80 overflow-hidden rounded-md">
          <Image src={imageLink} width={350} height={350} objectFit='cover' alt="main-image" quality={100} className="w-350px h-350px hover:cursor-pointer" />
        </div>
      </div>
      <div className="text-center pt-6">
        <h2 className="text-xl font-bold">{eventname}</h2>
      </div>

      {/* <Dialog>
        <DialogTrigger>
          <div className="text-center pt-4 pb-4">
            <Button>Know More</Button>
          </div>
        </DialogTrigger>
        <DialogContent className="flex flex-row gap-4 p-4 w-3/4 h-105">
          <div className="w-1/2">
            <Image src={imageLink} width={500} height={500} objectFit='cover' alt="main-image" quality={100} className="w-500 h-500 hover:cursor-pointer" />
          </div>
          <div className="w-1/2">
            <div className="">
              <h2 className="text-2xl font-bold text-blue-600">{eventname}</h2>
              <div className="gap-10 text-left">
                <div>Category: {category}</div>
                <div>Date: {formatDate(date)}</div>
                <div>Organisers: {organizers}</div>
                <div className='text-blue-500 text-xl font-semibold'>
                  Description
                </div>
                <div>{description}</div>
              </div>

            </div>
          </div>
        </DialogContent>

      </Dialog> */}
    </div>
  );
};




const AllEvent = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventProps[]>([]);
  useEffect(() => {
    // Fetch team data using HTTP request
    const fetchData = async () => {
      try {
        const response = await fetch('/api/trpc/getEvent');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Fetched data:', data);

        // Assuming the actual data structure matches what you expect
        const dataa = data?.result?.data?.dbE  ;

        // Map dbF to your TeamMemberProps
        const mappedEvents = dataa.map((event: any) => ({
            eventname: event.eventname || "",
            category: event.category || "",
            date: event.date || Date.now().toLocaleString(),
            registered: event.registered || "0",
            organizers: event.organizers || "",
            description: event.description || "",
            imageLink: event.imageLink || "",
        }));


        setEvents(mappedEvents);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      // Simulate an API request delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };

    fetchData();
  }, []);

  console.log(events);

  return (
    <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
      {loading ? (
        <Loader />
      ) : (
        <>
      
        <div className="mt-10 pb-10 flex flex-wrap gap-10 justify-center">
          {events.map((ev, index) => (
            <EventCard key={index} {...ev} />
          ))}
        </div>
        </>
      )}

      
    </MaxWidthWrapper>
  );
};

export default AllEvent;
