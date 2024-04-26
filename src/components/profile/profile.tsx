import { GitPullRequestIcon, LinkedinIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { buttonVariants } from "~/components/ui/button";
import localFont from "next/font/local";
import { api } from "~/utils/api";
export default function Profile() {
  const { data: session } = useSession();
  const user = session?.user;
  const id = user?.id ?? " ";
  const userData = api.user.getUserData.useQuery({ userid: id }).data;

  return (
    <>
      <main>
        <section className="bg-white text-black transition-colors duration-500 dark:bg-gray-900/10 dark:text-white">
          <div className="flex flex-col items-center justify-center text-center">
            <Fade triggerOnce cascade>
              {user ? (
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
                        className="relative-left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
                      ></div>
                    </div>

                    <div>
                      <div className="mx-auto max-w-6xl lg:px-8">
                        <div className="mb-24 flow-root sm:mt-24">
                          <div className="-m-2   w-[45rem] overflow-hidden rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <h1 className="mb-5 text-2xl font-bold">
                              Your Profile
                            </h1>

                            <div className="rounded-mx relative mx-auto h-80 w-80 overflow-hidden pt-2 ">
                              <Image
                                src={
                                  user?.image?.replace("=s96-c", "") ??
                                  "/favicon.ico"
                                }
                                alt={user?.name ?? "img-av"}
                                height={200}
                                width={200}
                                className="h-full w-full rounded-md object-cover hover:border-cyan-300"
                              />
                            </div>

                            <div className="pt-3">
                              <h1
                                className={`bg-gradient-to-b from-blue-600 to-violet-400 bg-clip-text pb-4 text-center text-4xl font-black text-transparent`}
                              >
                                {userData?.name}
                              </h1>
                            </div>
                            <div>
                              <h1>@{userData?.name}</h1>
                            </div>

                            <h4>
                              <span className="font-bold text-slate-400">
                                Bio :{" "}
                              </span>
                              {userData?.bio}
                            </h4>
                            <h4>
                              <span className="font-bold text-slate-400">
                                Branch :{" "}
                              </span>
                              {userData?.branch}
                            </h4>
                            <h4>
                              <span className="font-bold text-slate-400">
                                Role:{" "}
                              </span>
                              {userData?.role}
                            </h4>
                            <div className="mt-4 flex justify-center gap-4">
                              <Link
                                className={buttonVariants({
                                  variant: "outline",
                                  size: "icon",
                                  className:
                                    "rounded-full transition-colors hover:text-blue-500",
                                })}
                                href={userData?.linkedin ?? "/"}
                                target="_blank"
                              >
                                <LinkedinIcon size={24} />
                              </Link>
                              <Link
                                className={buttonVariants({
                                  variant: "outline",
                                  size: "icon",
                                  className:
                                    "rounded-full  transition-colors hover:text-gray-600",
                                })}
                                href={userData?.github ?? "/"}
                                target="_blank"
                              >
                                <GitPullRequestIcon size={24} />
                              </Link>
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
              ) : (
                <>
                  <h1>TODO</h1>
                </>
              )}
            </Fade>
          </div>
        </section>
      </main>
    </>
  );
}
