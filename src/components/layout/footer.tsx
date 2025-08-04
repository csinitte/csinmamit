"use client";
// import { usePathname } from 'next/navigation'
import Link from "next/link";
import React from "react";
import BlurImage from "../helpers/BlurImage";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

const Links = [
  { name: "Home", link: "/" },
  { name: "Events", link: "/events" },
  { name: "Team", link: "/team" },
  // { name: 'Services', link: '/shipping' },
];
const social = [
  {
    link: "https://www.instagram.com/csi_nmamit",
    icon: (
      <InstagramLogoIcon className="h-5 w-5 sm:h-6 sm:w-6 duration-200 hover:scale-125 hover:text-blue-500" />
    ),
    name: "Instagram",
  },
  {
    link: "https://twitter.com/csinmamit",
    icon: (
      <TwitterLogoIcon className="h-5 w-5 sm:h-6 sm:w-6 duration-200 hover:scale-125 hover:text-blue-500" />
    ),
    name: "Twitter",
  },
];

// const footLinks = [
//   { name: "Privacy", link: "/privacy" },
//   { name: "Terms and Conditions", link: "/rules" },
//   { name: "Refund & Cancellation", link: "/refund" },
//   { name: "Contact us", link: "/contact-us" },
//   { name: "Shipping", link: "/shipping" },
// ];

const Footer = () => {
  //   const pathname = usePathname();
  //   const pathsToMinimize = [
  //     '/verify-email',
  //     '/sign-up',
  //     '/sign-in',
  //   ];

  return (
    <footer className="bg-white-50 relative border-t border-gray-200 text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <BlurImage
            src="/csi-logo.png"
            width={80}
            height={80}
            alt="csi_logo"
            priority
            className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24"
          />
        </div>

        <h2 className="mt-4 sm:mt-5 flex cursor-pointer items-center justify-center text-center text-base sm:text-lg font-bold text-blue-600 dark:text-gray-100 md:text-xl px-4">
          Computer Society of India, NMAMIT
        </h2>

        <p className="mx-auto mt-4 sm:mt-6 max-w-md text-center text-sm sm:text-base leading-relaxed text-black dark:text-gray-200 px-4">
          NMAM Institute of Technology, Nitte, SH1, Karkala, Karnataka, KARKALA,
          NMAMIT 574110, IN
        </p>

        <nav className="mt-8 sm:mt-12">
          <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {Links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.link}
                  className="text-sm sm:text-base text-black transition hover:text-blue-500 dark:text-gray-100 dark:hover:text-gray-200/75 p-2"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-8 sm:mt-12 flex justify-center gap-6 pb-6 sm:pb-8 md:gap-8">
          {social.map((link, index) => (
            <li key={index}>
              <Link
                href={link.link}
                className="text-black transition hover:text-gray-200/75 dark:text-gray-100 p-2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                <span className="sr-only">{link.name}</span>
                {link.icon}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
