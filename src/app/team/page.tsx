"use client"
import { useState, useEffect } from 'react';
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { buttonVariants } from "@/components/ui/button";
import { GithubIcon, LinkedinIcon } from "lucide-react";
import Image from "next/image";
import { RotateLoader } from 'react-spinners'
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
        <Image
          src={imageSrc}
          width={250}
          height={250}
          alt="main-image"
          quality={100}
          className="rounded-md"
        />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">{name}</h2>
        <p className="text-blue-500">{position}</p>
        <div className="flex justify-center gap-4 mt-4">
          <p
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full transition-colors hover:text-blue-500",
            })}
          >
            <LinkedinIcon size={24} />
          </p>
          <p
            className={buttonVariants({
              variant: "outline",
              size: "icon",
              className: "rounded-full  transition-colors hover:text-gray-600",
            })}
          >
            <GithubIcon  size={24} />
          </p>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const [loading, setLoading] = useState(true);
  const teamMembers: TeamMemberProps[] = [
    // Simulating an asynchronous data fetch
    {
      name: "John Doe",
      position: "Software Engineer",
      linkedin: "https://www.linkedin.com/in/johndoe/",
      github: "https://github.com/johndoe",
      imageSrc: "/mock.png",
    },
    {
        name: "John Doe",
        position: "Software Engineer",
        linkedin: "https://www.linkedin.com/in/johndoe/",
        github: "https://github.com/johndoe",
        imageSrc: "/mock.png",
      },
      {
        name: "John Doe",
        position: "Software Engineer",
        linkedin: "https://www.linkedin.com/in/johndoe/",
        github: "https://github.com/johndoe",
        imageSrc: "/mock.png",
      },
    // Add more team members as needed
  ];

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
    <MaxWidthWrapper>
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
