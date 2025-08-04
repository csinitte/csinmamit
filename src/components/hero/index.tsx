import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { type FunctionComponent } from "react";
import { Button, buttonVariants } from "../ui/button";
import Loader from "../ui/loader";
import { ArrowRight } from "lucide-react";

const Hero: FunctionComponent = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  return (
    <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white px-4 sm:px-6 lg:px-8">
      <div className="mb-12 mt-8 sm:mt-14 lg:mt-28 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-4 sm:px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            CSI is now public!
          </p>
        </div>
        <Fade triggerOnce cascade>
          {user ? (
            <h1 className="max-w-4xl text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold px-4">
              Welcome back! <br></br>
              <span className="text-blue-600">{user.name}</span>
            </h1>
          ) : (
            <h1 className="max-w-4xl text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold px-4">
              Welcome to <br />
              <span className="text-blue-600">CSI NMAMIT</span>
            </h1>
          )}

          <p className="text-sm sm:text-base lg:text-lg mt-5 max-w-prose text-zinc-700 sm:leading-relaxed px-4">
            Computer Society of India, NMAMIT
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:gap-8 px-4">
            {status === "loading" ? (
              <Loader />
            ) : status === "authenticated" ? (
              <>
                <Link
                  className={buttonVariants({
                    size: "default",
                    className: "mt-5 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3",
                  })}
                  href={"/events"}
                  target="_blank"
                >
                  Explore Events <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </>
            ) : (
              <Button 
                onClick={() => signIn("google")}
                className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
              >
                Sign In
              </Button>
            )}
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default Hero;
