"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AuthButton from "../auth/auth-button";
import { buttonVariants } from "../ui/button";
import MaxWidthWrapper from "./max-width-wrapper";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all dark:bg-black">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="z-40 flex font-semibold" onClick={closeMenu}>
              <div className="flex h-14 items-center justify-between gap-2 sm:gap-5">
                <Image
                  src="/csi-logo.png"
                  alt="CSI Logo"
                  width={30}
                  height={30}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <span className="text-sm sm:text-base text-blue-600 hidden xs:block">
                  Computer Society of India.
                </span>
                <span className="text-sm text-blue-600 xs:hidden">
                  CSI NMAMIT
                </span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden items-center space-x-4 sm:flex">
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Home
              </Link>
              <Link
                href="/events"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Events
              </Link>
              <Link
                href="/team"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Team
              </Link>
              <AuthButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </MaxWidthWrapper>

        {/* Mobile Navigation Menu */}
        <div
          className={`sm:hidden fixed inset-x-0 top-16 bg-white dark:bg-black border-b border-gray-200 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
          }`}
        >
          <div className="flex flex-col p-4 space-y-2">
            <Link
              href="/"
              className={buttonVariants({
                variant: "ghost",
                size: "default",
                className: "w-full justify-start",
              })}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={buttonVariants({
                variant: "ghost",
                size: "default",
                className: "w-full justify-start",
              })}
              onClick={closeMenu}
            >
              Events
            </Link>
            <Link
              href="/team"
              className={buttonVariants({
                variant: "ghost",
                size: "default",
                className: "w-full justify-start",
              })}
              onClick={closeMenu}
            >
              Team
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
