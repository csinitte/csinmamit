'use client'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'
import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper';
import React from 'react'
import { DiscIcon, Github, Instagram, Linkedin, Newspaper, Twitter, Youtube } from 'lucide-react';
import { Button } from './ui/button';

// ... (other imports)

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = [
    '/verify-email',
    '/sign-up',
    '/sign-in',
  ];

  return (
    <footer className="bg-white flex-grow-0">

      <div className="border-t border-gray-200"></div>
      <MaxWidthWrapper>
        <div className="flex flex-col lg:flex-row md:flex-row  lg:space-x-16 md:space-x-16 space-y-5 lg:space-y-0 md:space-y-0px-14 py-8">

          <div className="flex flex-col gap-3 lg:w-1/4 md:w-1/2 w-full">
            <h1 className="font-bold text-3xl text-blue-600">Computer Society of India</h1>
            <h3>
              NMAM Institute of Technology, Nitte, SH1, Karkala, Karnataka, KARKALA, NMAMIT 574110, IN
            </h3>
            <h2 className="text-xl">
              Build With <span> 💙 </span> by&nbsp;{" "}
              <Link href={"https://github.com/dhanushlnaik"} target={"_blank"}>
                Tatsui
              </Link>
            </h2>
          </div>

          <div className="flex flex-col lg:w-1/4 md:w-1/2 w-full">
            <p className="text-xl underline underline-offset-4 font-bold">Links</p>
            <Link href={"/"}>Home</Link>
            <Link href={"/team"}>Team</Link>
            <Link href={"/status"}>Events</Link>
          </div>

          {/* Stack 3 */}
          <div className="flex flex-col lg:w-1/4 md:w-1/2 w-full space-y-5">
            <h1 className="text-xl font-bold">Follow Us</h1>

            <div className="flex space-x-10">
              <Link href={"https://twitter.com/csinmamit"} target={"_blank"}>
                <Twitter size={25} className="hover:scale-125 duration-200" />
              </Link>
              <Link href={"https://www.instagram.com/csinmamit"} target={"_blank"}>
                <Instagram size={25} className="hover:scale-125 duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>

    </footer>
  );
};

export default Footer;
