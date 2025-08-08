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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.id));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    void fetchUserData();
  }, [user?.id]);

  if (!user) {
    return (
      <main className="flex items-center justify-center min-h-screen text-xl">
        <p>Please sign in to view your profile</p>
      </main>
    );
  }

  const displayName = (userData?.name as string) ?? user?.name ?? "Anonymous";
  const bio = (userData?.bio as string) ?? "No bio available";
  const branch = (userData?.branch as string) ?? "Not specified";
  const role = (userData?.role as string) ?? "User";
  const linkedin = (userData?.linkedin as string) ?? "/";
  const github = (userData?.github as string) ?? "";
  const githubUrl = github ? `https://github.com/${github}` : "/";

  return (
    <main className="relative min-h-screen dark:from-gray-900 dark:via-gray-800 dark:to-black text-black dark:text-white">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-300/30 via-transparent to-transparent dark:from-indigo-900/20"></div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-28">
        <Fade triggerOnce>
          <div className="rounded-[2rem] bg-white/40 dark:bg-white/5 backdrop-blur-xl p-12 shadow-2xl ring-1 ring-gray-300/30 dark:ring-white/10 transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-52 w-52 overflow-hidden rounded-full ring-8 ring-blue-500/30 shadow-2xl mb-6">
                <Image
                  src={user?.image?.replace("=s96-c", "") ?? "/favicon.ico"}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-violet-500 bg-clip-text text-transparent">
                {displayName}
              </h1>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                @{displayName}
              </p>

              <span className="inline-block rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200 mb-6">
                {role}
              </span>

              <div className="space-y-2 text-base text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold text-slate-500">Bio:</span>{" "}
                  {bio}
                </p>
                <p>
                  <span className="font-semibold text-slate-500">Branch:</span>{" "}
                  {branch}
                </p>
              </div>

              <div className="mt-8 flex gap-6">
                <Link
                  href={linkedin}
                  target="_blank"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className:
                      "rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition shadow-sm",
                  })}
                >
                  <LinkedinIcon size={26} />
                </Link>
                <Link
                  href={githubUrl}
                  target="_blank"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon",
                    className:
                      "rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition shadow-sm",
                  })}
                >
                  <Github size={26} />
                </Link>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </main>
  );
}
