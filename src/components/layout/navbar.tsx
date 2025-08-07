import Link from "next/link";
// import { Home } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import AuthButton from "../auth/auth-button";
import { buttonVariants } from "../ui/button";
import MaxWidthWrapper from "./max-width-wrapper";
import { env } from "../../env";
import { useAuth } from "../../lib/firebase-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export function Navbar() {
  const { user } = useAuth();
  const [hasActiveMembership, setHasActiveMembership] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for active membership
  useEffect(() => {
    const checkMembershipStatus = async () => {
      if (!user?.id) {
        setHasActiveMembership(false);
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        if (userDoc.exists()) {
          const data = userDoc.data() as Record<string, unknown>;
          if (data.membershipEndDate) {
            const membershipEndDate = data.membershipEndDate as { toDate?: () => Date } | Date;
            const endDate = typeof membershipEndDate === 'object' && membershipEndDate !== null && 'toDate' in membershipEndDate && typeof membershipEndDate.toDate === 'function'
              ? membershipEndDate.toDate()
              : new Date(membershipEndDate as Date);
            const today = new Date();
            setHasActiveMembership(today < endDate);
          } else {
            setHasActiveMembership(false);
          }
        } else {
          setHasActiveMembership(false);
        }
      } catch (error) {
        console.error('Error checking membership status:', error);
        setHasActiveMembership(false);
      } finally {
        setIsLoading(false);
      }
    };

    void checkMembershipStatus();
  }, [user?.id]);

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
              {env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && !hasActiveMembership && !isLoading && user && (
                <Link
                  href="/recruit"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "bg-blue-600 hover:bg-blue-700 text-white"
                  })}
                >
                  Get Membership
                </Link>
              )}
              <AuthButton />
            </div>
            
            {/* Mobile menu */}
            <div className="flex items-center space-x-2 sm:hidden">
              {env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && !hasActiveMembership && !isLoading && user && (
                <Link
                  href="/recruit"
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                    className: "bg-blue-600 hover:bg-blue-700 text-white"
                  })}
                >
                  Get Membership
                </Link>
              )}
              <AuthButton />
            </div>
          </div>
        </MaxWidthWrapper>
      </nav>
    </>
  );
}
