import { type FunctionComponent } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import MaxWidthWrapper from "../layout/max-width-wrapper";
import { TypeAnimation } from "react-type-animation";
import { Button } from "../ui/button";
import { ArrowRight, GroupIcon } from "lucide-react";
import Link from "next/link";
import { ImageSlider } from "../helpers/ImageSlider";
import localFont from "next/font/local";
import Testimonials from "../testimonials";
import { env } from "../../env";
import { useAuth } from "../../lib/firebase-auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const myFont = localFont({ src: "../../pages/obscura.otf" });

const HomePage: FunctionComponent = () => {
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
      <section className="bg-pink-200 text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
        <MaxWidthWrapper>
          <div className="flex flex-col items-center justify-center gap-8 p-8 sm:flex-row">
            <div className="flex w-full flex-col items-center sm:w-1/2 sm:items-start">
              <h2 className="mb-4 max-w-3xl text-center text-3xl font-bold text-blue-600 sm:text-left sm:text-5xl md:text-5xl lg:text-6xl">
                A community driven{" "}
                <TypeAnimation
                  sequence={[
                    // Same substring at the start will only be typed out once, initially
                    "by learning.",
                    1000, // wait 1s before replacing "Mice" with "Hamsters"
                    "by inspiration.",
                    1000,
                    "by collaboration.",
                    1000,
                    "by diversity.",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </h2>
              <p className="text-left">
                Learn something new at an event, form a team to participate
                with, or find out more about the field! The CSI NMAMIT welcomes
                you, regardless of your experience or department.
              </p>
              <div className="mt-10 flex gap-6">
                {env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && !hasActiveMembership && !isLoading && user && (
                  <Link href={"/recruit"}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                      Get Executive Membership <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href={"/team"}>
                  <Button variant={"blue"}>
                    Team <GroupIcon className="ml-2 h-5 w-5" />{" "}
                  </Button>
                </Link>
                <Link href={"/events"}>
                  <Button variant={"outline"}>
                    Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-4 w-full cursor-pointer overflow-hidden rounded-lg sm:mt-0 sm:w-1/2">
              <Image
                src={"/hero.jpg"}
                width={1000}
                height={750}
                alt="main-image"
                quality={100}
                className="rounded-md"
              />
            </div>
          </div>
        </MaxWidthWrapper>
      </section>

      <hr className="border-black-500/50" />

      <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
        <MaxWidthWrapper>
          <h1
            className={`${myFont.className} bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 pt-20 text-center text-6xl font-black text-transparent`}
          >
            Highlights
          </h1>
          <p className=" sm-text-l pb-5 text-center font-semibold text-zinc-700">
            We have successfully reached out many events. As we reflect back,
            here are some of the events organized by CSI!
          </p>
          <div className="mx-auto flex w-3/4 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg">
            <ImageSlider />
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-blue-50 text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
        <MaxWidthWrapper>
          <h1
            className={`${myFont.className} bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 pt-20 text-center text-6xl font-black text-transparent`}
          >
            Executive Membership Benefits
          </h1>
          <p className="sm-text-l pb-5 text-center font-semibold text-zinc-700">
            Join CSI NMAMIT as an Executive Member and unlock exclusive benefits
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Technical Workshops</h3>
              <p className="text-gray-600">Access to exclusive technical workshops, coding sessions, and skill development programs</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Networking</h3>
              <p className="text-gray-600">Connect with industry professionals, alumni, and fellow tech enthusiasts</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Events & Competitions</h3>
              <p className="text-gray-600">Participate in hackathons, tech competitions, and exclusive CSI events</p>
            </div>
          </div>
          <div className="text-center pb-12">
            {env.NEXT_PUBLIC_MEMBERSHIP_ENABLED === "true" && !hasActiveMembership && !isLoading && user ? (
              <Link href="/recruit">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3">
                  Get Executive Membership Now
                </Button>
              </Link>
            ) : env.NEXT_PUBLIC_MEMBERSHIP_ENABLED !== "true" ? (
              <div className="text-gray-500 italic">
                Membership registration is currently closed
              </div>
            ) : hasActiveMembership ? (
              <div className="text-green-600 font-semibold">
                ✓ You have an active membership
              </div>
            ) : null}
          </div>
        </MaxWidthWrapper>
      </section>

      <section className="bg-gray-600/10 text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
        <MaxWidthWrapper>
          <h1
            className={`${myFont.className} bg-gradient-to-b from-violet-600 to-purple-400 bg-clip-text pb-4 pt-20 text-center text-6xl font-black text-transparent`}
          >
            Testimonials
          </h1>
          <p className=" sm-text-l pb-5 text-center font-semibold text-zinc-700">
            Explore testimonials showcasing the impactful experiences and growth
            stories within the CSI.
          </p>
          <div className="mx-auto flex w-3/4 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg">
            <Testimonials />
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
};

export default HomePage;
