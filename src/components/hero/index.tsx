import { useAuth } from "~/lib/firebase-auth";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { type FunctionComponent } from "react";
import { Button, buttonVariants } from "../ui/button";
import Loader from "../ui/loader";
import { ArrowRight } from "lucide-react";

const Hero: FunctionComponent = () => {
  const { user, loading, signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
      <div className="mb-12 mt-14 flex flex-col items-center justify-center text-center sm:mt-28">
        <div className="mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-gray-200 bg-white px-7 py-2 shadow-md backdrop-blur transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-sm font-semibold text-gray-700">
            CSI is now public!
          </p>
        </div>
        <Fade triggerOnce cascade>
          {user ? (
            <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">
              Welcome back! <br></br>
              <span className="text-blue-600">{user.name}</span>
            </h1>
          ) : (
            <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">
              Welcome to <br />
              <span className="text-blue-600">CSI NMAMIT,</span>
            </h1>
          )}

          <p className="sm-text-lg mt-5 max-w-prose text-zinc-700 sm:leading-relaxed">
            Computer Society of India, NMAMIT
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:gap-8">
            {loading ? (
              <Loader />
            ) : user ? (
              <>
                <Link
                  className={buttonVariants({
                    size: "lg",
                    className: "mt-5",
                  })}
                  href={"/events"}
                  target="_blank"
                >
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                {/* <Link
                    href="/register"
                    className="block w-auto rounded bg-yellow-300 px-8 py-2 font-medium text-black shadow duration-300 hover:scale-[1.03] hover:text-gray-600 focus:outline-none focus:ring active:text-yellow-500 lg:px-12 lg:py-3"
                  >
                    Register
                  </Link> */}
              </>
            ) : (
              <Button onClick={handleSignIn}>
                <a>Sign In</a>
              </Button>
            )}
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default Hero;
