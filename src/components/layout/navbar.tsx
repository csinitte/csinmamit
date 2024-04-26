import Link from "next/link";
// import { Home } from "lucide-react";
import Image from "next/image";
import AuthButton from "../auth/auth-button";
import { buttonVariants } from "../ui/button";
import MaxWidthWrapper from "./max-width-wrapper";

export function Navbar() {
  return (
    <>
      <nav className="sticky inset-x-0 top-0 z-30 h-16 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all dark:bg-black">
        <MaxWidthWrapper>
          <div className="flex h-16 items-center justify-between border-b border-zinc-200">
            <Link href="/" className="z-40 flex font-semibold">
              <div className="flex h-14 items-center justify-between gap-5">
                <Image
                  src="/csi-logo.png"
                  alt="CSI Logo"
                  width={30}
                  height={30}
                />
                <span className="text-blue-600 ">
                  Computer Society of India.
                </span>
              </div>
            </Link>
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
          </div>
        </MaxWidthWrapper>
      </nav>
    </>
  );
}
