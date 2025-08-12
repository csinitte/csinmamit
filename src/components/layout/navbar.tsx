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

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 inset-x-0 z-30 w-full h-16 border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all dark:bg-black">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center justify-between">
            {/* Logo Section */}
            <Link href="/" className="z-40 flex font-semibold" onClick={closeMenu}>
              <div className="flex h-14 items-center gap-2 sm:gap-5">
                <Image
                  src="/csi-logo.png"
                  alt="CSI Logo"
                  width={30}
                  height={30}
                  className="h-8 w-8 sm:h-10 sm:w-10"
                />
                <span className="hidden xs:block text-sm sm:text-base text-blue-600">
                  Computer Society of India.
                </span>
                <span className="xs:hidden text-sm text-blue-600">
                  CSI NMAMIT
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4">
              {["/", "/events", "/team"].map((href, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  {href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
                </Link>
              ))}
              {/* <Link href="/recruit" className={buttonVariants({ variant: "ghost", size: "sm" })}>Join CSI</Link> */}
              <AuthButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="sm:hidden p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </MaxWidthWrapper>
      </nav>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/30 backdrop-blur-sm sm:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed sm:hidden inset-x-0 top-16 z-30 bg-white dark:bg-black border-b border-gray-200 transform transition-all duration-300 ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-4 space-y-2">
          {["/", "/events", "/team"].map((href, idx) => (
            <Link
              key={idx}
              href={href}
              onClick={closeMenu}
              className={buttonVariants({
                variant: "ghost",
                size: "default",
                className: "w-full justify-start",
              })}
            >
              {href === "/" ? "Home" : href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
            </Link>
          ))}

          <div className="pt-2 border-t border-gray-200 flex justify-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </>
  );
}
