import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { buttonVariants } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const Dashboard = () => {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Welcome to <br></br>
          <span className="text-blue-600">CSI NMAMIT,</span>
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm-text-lg">
          Computer Society of India, NMAMIT
        </p>

        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-5",
          })}
          href={"/addteam"}
          target="_blank"
        >
          Add your profile <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxWidthWrapper>

      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative-left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            ></div>
          </div>

          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
              <div className="mt-16 mb-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  <div className="flex justify-center items-center gap-8 p-8">
                    <div className="w-1/2 flex flex-col items-center">
                      <h1 className="max-w-3xl text-4xl font-bold md:text-5xl lg:text-6xl text-blue-600 mb-4">
                        About Us
                      </h1>
                      <p className="text-left">
                        Embark on a transformative journey with the Computer
                        Society of India, NMAMIT Student Branch, where
                        technology meets community, and ideas take flight. We
                        are not just an organization; we are a family that
                        fosters growth, innovation, and a shared passion for all
                        things tech. At CSI, we believe in shaping the future of
                        technology enthusiasts by providing a holistic
                        perspective on development and empowering students to
                        turn their ideas into impactful solutions.
                      </p>
                    </div>

                    <div className="w-1/2 cursor-pointer overflow-hidden rounded-lg ">
                      <Image
                        src={"/team.jpg"}
                        width={1000}
                        height={750}
                        alt="main-image"
                        quality={100}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative-left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
