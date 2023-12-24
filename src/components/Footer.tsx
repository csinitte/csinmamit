'use client'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper';
import React from 'react'
import { DiscIcon, Github, Instagram, Linkedin, Newspaper, Twitter, Youtube } from 'lucide-react';
import { Button } from './ui/button';

const Footer = () => {
  const pathname = usePathname()
  const pathsToMinimize = [
    '/verify-email',
    '/sign-up',
    '/sign-in',
  ]

  return (
    <footer className='bg-white flex-grow-0'>

        <div className='border-t border-gray-200'>
        </div>
        <MaxWidthWrapper>
        <div
    className={` lg:flex md:flex block justify-evenly lg:space-x-16 md:space-x-16 space-y-5 lg:space-y-0 md:space-y-0px-14 py-8`}
  >

        <div className="flex flex-col gap-3">
        <h1 className="font-bold text-3xl text-blue-600">Computer Society of India</h1>
        <h3>
        NMAM Institute of Technology, Nitte, SH1, Karkala, Karnataka, KARKALA, NMAMIT 574110, IN
        </h3>
        <h2 className="text-xl">
          Build With <span> 💙 </span> by&nbsp;{" "}
          <Link href={"https://avarch.org"} target={"_blank"}>
            Tatsui
          </Link>
        </h2>
      </div>

      <div className="flex flex-col">
        <p className="text-xl underline underline-offset-4 font-bold">Links</p>
        <Link href={"/"}>Home</Link>
        <Link href={"/team"}>Team</Link>
        <Link href={"/status"}>Events</Link>

      </div>

      {/* Stack 3 */}
      <div className="flex flex-col space-y-5">
        <h1 className="text-xl font-bold">Follow Us</h1>

        <div className="flex space-x-10">
          <Link href={"https://twitter.com/ether_world"} target={"_blank"}>
            <Twitter size={25} className="hover:scale-125 duration-200" />
          </Link>
          <Link href={"https://www.instagram.com/etherworld.co/?hl=en"} target={"_blank"}>
            <Instagram size={25} className="hover:scale-125 duration-200" />
          </Link>
          <Link href={"https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA"} target={"_blank"}>
            <Youtube size={25} className="hover:scale-125 duration-200" />
          </Link>
          <Link href={"https://www.linkedin.com/company/avarch-llc/"} target={"_blank"}>
            <Linkedin size={25} className="hover:scale-125 duration-200" />
          </Link>

        </div>


      </div>
    </div>
        {/* <div className='mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8 justify-center'>
        <div className='cursor-pointer flex items-center  justify-center text-lg text-blue-600 font-semibold  dark:text-gray-100 md:text-xl'>
            Computer Society of India, NMAMIT
        </div>
        <p className='mx-auto mt-6 max-w-md text-center leading-relaxed text-black dark:text-gray-200'>
        NMAM Institute of Technology, Nitte, SH1, Karkala, Karnataka, KARKALA, NMAMIT 574110, IN
        </p>
        </div>

        <div className='py-10 md:flex md:items-center md:justify-between'>
            
          <div className='text-center md:text-left'>
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} All Rights
              Reserved
            </p>
          </div>

          <div className='mt-4 flex items-center justify-center md:mt-0'>
            <div className='flex space-x-8'>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Terms
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </Link>
              <Link
                href='#'
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Cookie Policy
              </Link>
            </div>
          </div>
          
        </div> */}
        
        </MaxWidthWrapper>
     
    </footer>
  )
}

export default Footer