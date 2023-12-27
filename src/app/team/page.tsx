"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
import { trpc } from '../_trpc/client';
import Link from 'next/link';
import AnimatedGradientText from '@/components/AnimatedGradientText';
// Loader component
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    {/* You can customize the loader's appearance here */}
    
    <RotateLoader color="#2563eb" />
  </div>
);

interface TeamMemberProps {
  name: string;
  position: string;
  linkedin: string;
  github: string;
  imageSrc: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, position, linkedin, github, imageSrc }) => {
  return (
    <div className="-m-2 rounded-xl bg-gray-900/5 p-4 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-6 hover:ring-blue-500 transition-all">
      <div className="flex justify-center items-center gap-4 p-4">
      <div className="relative w-48 h-48 overflow-hidden rounded-md">
        <Image
          src={imageSrc}
          width={250}
          height={250}
          alt="main-image"
          quality={100}
          className="object-cover w-full h-full rounded-md"
        
        />
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-blue-500">{position}</p>
        <div className="flex justify-center gap-4 mt-4">
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full transition-colors hover:text-blue-500",
            })} href={linkedin} target='_blank'
          >
            <LinkedinIcon size={24} />
          </Link>
          <Link
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full  transition-colors hover:text-gray-600",
            })} href={github} target='_blank'
          >
            <GithubIcon  size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberProps[]>([]);
  const roleOptions = ["Chairman", "Vice Chairman", "Secretary", "Treasurer", "Joint Secretary", "Program Committee Head", "Program Committee Co-Head", "Social Media Head", "Web Editor Head", "Web Editor Co-Head", "MC Committee Head", "MC Committee Co-Head", "Graphic Committee Head", "Graphic Committee Co-Head", "Magazine Committee Head", "Magazine Committee Co-Head", "Photography Committee Head", "Photography Committee Co-Head", "Android Domain Head", "Android Domain Co-Head", "Web Domain Head", "Web Domain Co-Head", "AIML Domain Head", "AIML Domain Co-Head", "CyberSecurity Domain Head", "CyberSecurity Domain Co-Head", "Final Year Representative", "Third Year Representative", "Second Year Representative", "Student Advisor" ];

  useEffect(() => {
    // Fetch team data using HTTP request
    const fetchData = async () => {
      try {
        const response = await fetch('/api/trpc/getTeam');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('Fetched data:', data);

        // Assuming the actual data structure matches what you expect
        const dataa = data?.result?.data?.dbF ;

        // Map dbF to your TeamMemberProps
        const mappedTeamMembers = dataa.map((member: any) => ({
          name: member.name,
          position: member.role,
          linkedin: member.linkedin || '',
          github: member.github || '',
          imageSrc: member.imageLink || '/default-image.png', // Provide a default image source
        }));
        const sortedTeamMembers = mappedTeamMembers.sort((a: any, b: any) =>
        roleOptions.indexOf(a.position) - roleOptions.indexOf(b.position)
      );

        setTeamMembers(sortedTeamMembers);
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

  console.log(teamMembers)

  return (
    <MaxWidthWrapper className="mb-12 mt-9 sm:mt-12 flex flex-col items-center justify-center text-center">
      <div className='mt-10 mb-10'>
      <AnimatedGradientText>Meet the Team</AnimatedGradientText>
      <p className="mt-5 max-w-prose text-zinc-700 sm-text-lg font-semibold underline">CSI NMAMIT - 2024</p>
      </div>
      
      {loading ? (
        <Loader />
      ) : (
        <div className="mt-10 pb-10 flex flex-wrap gap-20 justify-center">
          {teamMembers.map((member, index) => (
            <TeamMember key={index} {...member} />
          ))}
        </div>
      )}
    </MaxWidthWrapper>
  );
};

export default Team;
