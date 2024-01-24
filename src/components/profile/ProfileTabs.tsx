"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { RotateLoader } from 'react-spinners';
import { motion, useAnimation } from 'framer-motion';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedGradientTexth2, AnimatedGradientTexth3 } from '../AnimatedGradientText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileUI from '../profile/ProfileUI';
import Edit from './editw';
import Certificates from '../profile/certificates';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { usePathname } from 'next/navigation';
import OtherProfile from './OtherProfile';

interface TabsProps {
  name : string,
  username: string,
  pfp:  string,
  bio:  string,
  branch: string,
  github: string,
  linkedin: string,
  role: string,
  phonenumber: string
}
const ProfileTabs:React.FC<TabsProps> = ({name, username, pfp, bio, branch, github, linkedin, role, phonenumber}) => {
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const pathname = usePathname();


  useEffect(() => {
    // Simulating loading delay (replace this with actual data fetching)
    const delay = setTimeout(() => {
      setLoading(false);
      controls.start({ opacity: 1, y: 0 });
    }, 2000);

    // Clear the timeout on component unmount
    return () => clearTimeout(delay);
  }, [controls]);

  const userData = {
    name : name,
    username: username,
    phonenumber: phonenumber,
    pfp:  pfp,
    bio:  bio,
    branch: branch,
    github: github,
    linkedin: linkedin,
    role: role

  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <RotateLoader color="#2563eb" />
      </div>
    );
  }
  

  
  if(pathname?.split("/")[1] === "u") {
    return (
      <OtherProfile username={pathname.split("/")[2]}/>
    )
  }

  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">

      <Tabs defaultValue="profile" >
  <TabsList>
    <TabsTrigger value="profile">Profile</TabsTrigger>
    <TabsTrigger value="edit">Edit</TabsTrigger>
    <TabsTrigger value="certificates">Certificates</TabsTrigger>
  </TabsList>
  <TabsContent value="profile"><ProfileUI data={userData}/></TabsContent>
  <TabsContent value="edit"><Edit username={userData.username}/></TabsContent>
  <TabsContent value="certificates"><Certificates/></TabsContent>
</Tabs>

      
      </MaxWidthWrapper>

    </>
  );
};

export default ProfileTabs;
