"use client";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import React from "react";
import { Button } from "./ui/button";
import BlurImage from "./BlurImage";
import {
  DiscIcon,
  Github,
  Instagram,
  Linkedin,
  Newspaper,
  Twitter,
  Youtube,
} from "lucide-react";

const Links = [
  { name: "Home", link: "/" },
  { name: "Events", link: "/events" },
  { name: "Team", link: "/team" },
  // { name: 'Services', link: '/shipping' },
];

const social = [
  {
    link: "https://www.instagram.com/csinmamit",
    icon: (
      <Instagram
        size={25}
        className="hover:scale-125 duration-200 hover:text-blue-500"
      />
    ),
    name: "Instagram",
  },
  {
    link: "https://twitter.com/csinmamit",
    icon: (
      <Twitter
        size={25}
        className="hover:scale-125 duration-200 hover:text-blue-500"
      />
    ),
    name: "Twitter",
  },
];

const footLinks = [
  { name: "Privacy", link: "/privacy" },
  { name: "Terms and Conditions", link: "/rules" },
  { name: "Refund & Cancellation", link: "/refund" },
  { name: "Contact us", link: "/contact-us" },
  { name: "Shipping", link: "/shipping" },
];

const Footer = () => {
  const pathname = usePathname();
  const pathsToMinimize = ["/verify-email", "/sign-up", "/sign-in"];

  return (
    <footer className="bg-white-50 text-black transition-colors duration-500 relative dark:bg-gray-900/10 dark:text-white border-t border-gray-200">
      <div className="border-t border-gray-200 mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8"></div>
      <MaxWidthWrapper>
        <div className="flex items-center justify-center">
          <BlurImage
            src="/csi-logo.png"
            width={100}
            height={100}
            alt="csi_logo"
            priority
          />
        </div>

        <a className="flex items-center justify-center ml-3 text-center cursor-pointer mt-5 text-lg text-blue-600 font-bold dark:text-gray-100 md:text-xl">
          Computer Society of India, NMAMIT
        </a>

        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-black dark:text-gray-200">
          NMAM Institute of Technology, Nitte, SH1, Karkala, Karnataka, KARKALA,
          NMAMIT 574110, IN
        </p>

        <nav className="mt-12">
          <ul className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
            {Links.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.link}
                  className="text-black transition hover:text-blue-500 dark:text-gray-100 dark:hover:text-gray-200/75"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="mt-12 flex justify-center gap-6 md:gap-8 pb-8">
          {social.map((link, index) => (
            <li key={index}>
              <Link
                href={link.link}
                className="text-black transition hover:text-gray-200/75 dark:text-gray-100"
              >
                <span className="sr-only">{link.name}</span>
                {link.icon}
              </Link>
            </li>
          ))}
        </ul>
      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
