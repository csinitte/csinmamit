import { useState, useEffect } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { RotateLoader } from 'react-spinners';
import { motion, useAnimation } from 'framer-motion';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AnimatedGradientTexth2, AnimatedGradientTexth3 } from './AnimatedGradientText';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileUI from './profile/ProfileUI';
import Edit from './profile/edit';
import Certificates from './profile/certificates';


import { redirect } from 'next/navigation'
import { db } from '@/db';
import ProfileTabs from './profile/ProfileTabs';


const Profile = async  () => {


  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user || !user.id) redirect('/')

  const dbUser = await db.user.findFirst({
    where: {
      custid: user.id
    }
  })

  if(!dbUser) redirect('/auth-callback?origin=dashboard')
  

 

  const userData = await db.members.findFirst({
    where: {
      custid: user.id,
    }
  })
  let name = user.given_name || "";
  let role = "Member"
  const ifCore = await db.team.findFirst({
    where: {
      custid: user.id
    }
  })

  if(ifCore) {
    role = ifCore.role
  }

  if(!userData) {
    await db.members.create({
      data: {
        custid: user.id,
        name: name,
        username: name.toLowerCase(),
        email: user.email || '',
        role: "Member",
        pfp: user.picture || ""
      },
    })
  }
  if(name.startsWith("NNM")) name = user.family_name || "";

  let username = userData?.username || "";
  let pfp = user.picture || "/mock.png";
  let bio = userData?.bio || "";
  let branch = userData?.branch || "";
  let github = userData?.github || "";
  let linkedin = userData?.linkedin || "";



  return (
    <>
      <ProfileTabs name={name} username={username} pfp={pfp} bio={bio} branch={branch} github={github} linkedin={linkedin} role={role}/>
    </>
  );
};

export default Profile;
