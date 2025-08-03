import { LinkedinIcon, Github } from "lucide-react";
import { useAuth } from "~/lib/firebase-auth";
import Image from "next/image";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import { buttonVariants } from "~/components/ui/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";

export default function Profile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [certificates, setCertificates] = useState<string[]>([]);
  
  // Load user data from Firestore
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.id));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setCertificates((data.certificates as string[]) ?? []);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadUserData();
  }, [user?.id]);

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
                                {(userData?.name as string) ?? user?.name}
                              </h1>
                            </div>
                            <div>
                              <h1>@{(userData?.name as string) ?? user?.name}</h1>
                            </div>

                            <h4>
                              <span className="font-bold text-slate-400">
                                Bio :{" "}
                              </span>
                              {(userData?.bio as string) ?? "No bio available"}
                            </h4>
                            <h4>
                              <span className="font-bold text-slate-400">
                                Branch :{" "}
                              </span>
                              {(userData?.branch as string) ?? "Not specified"}
                            </h4>
                            <h4>
                              <span className="font-bold text-slate-400">
                                Role:{" "}
                              </span>
                              {(userData?.role as string) ?? "User"}
                            </h4>
                            <div className="mt-4 flex justify-center gap-4">
                              <Link
                                className={buttonVariants({
                                  variant: "outline",
                                  size: "icon",
                                  className:
                                    "rounded-full transition-colors hover:text-blue-500",
                                })}
                                href={(userData?.linkedin as string) ?? "/"}
                                target="_blank"
                              >
                                <LinkedinIcon size={24} />
                              </Link>
                              {(() => {
                                const githubUrl = (userData?.github as string) ?? "";
                                return (
                                  <Link
                                    className={buttonVariants({
                                      variant: "outline",
                                      size: "icon",
                                      className:
                                        "rounded-full  transition-colors hover:text-gray-600",
                                    })}
                                    href={githubUrl ? `https://github.com/${githubUrl}` : "/"}
                                    target="_blank"
                                  >
                                    <Github size={24} />
                                  </Link>
                                );
                              })()}
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
                  <h1>Please sign in to view your profile</h1>
                </>
              )}
            </Fade>
          </div>
        </section>
      </main>
    </>
  );
}
