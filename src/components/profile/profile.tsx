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

      {/* Shared Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col items-center justify-center">

        <Fade triggerOnce>
          {/* Desktop */}
          <div className="hidden md:flex w-full bg-white/20 dark:bg-white/5 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/30 dark:border-white/10 transition-all duration-500">
            
            {/* Image Section */}
            <div className="w-1/2 relative bg-gradient-to-br from-blue-100/50 to-violet-100/30 dark:from-blue-900/20 dark:to-violet-900/20 flex items-center justify-center p-10">
              <div className="relative h-64 w-64 rounded-full overflow-hidden ring-[10px] ring-blue-500/20 shadow-xl">
                <Image
                  src={user?.image?.replace("=s96-c", "") ?? "/favicon.ico"}
                  alt={displayName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Info Section */}
            <div className="w-1/2 p-10 flex flex-col justify-center space-y-4">
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {displayName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm">@{displayName}</p>
              <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-1 rounded-full text-sm font-semibold shadow">
                {role}
              </span>
              <p className="text-base text-gray-800 dark:text-gray-200"><strong>Bio:</strong> {bio}</p>
              <p className="text-base text-gray-800 dark:text-gray-200"><strong>Branch:</strong> {branch}</p>

              <div className="mt-4 flex gap-6">
                <Link
                  href={linkedin}
                  target="_blank"
                  className="transition transform hover:scale-110 hover:text-blue-600"
                >
                  <LinkedinIcon size={28} />
                </Link>
                <Link
                  href={githubUrl}
                  target="_blank"
                  className="transition transform hover:scale-110 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  <Github size={28} />
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden w-full bg-white/30 dark:bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl text-center space-y-4">
            <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden ring-[6px] ring-blue-400/40 shadow-lg">
              <Image
                src={user?.image?.replace("=s96-c", "") ?? "/favicon.ico"}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
              {displayName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{displayName}</p>
            <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-4 py-1 rounded-full text-sm font-semibold">
              {role}
            </span>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <p><strong>Bio:</strong> {bio}</p>
              <p><strong>Branch:</strong> {branch}</p>
            </div>

            <div className="mt-3 flex justify-center gap-5">
              <Link href={linkedin} target="_blank" className="hover:text-blue-600">
                <LinkedinIcon size={24} />
              </Link>
              <Link href={githubUrl} target="_blank" className="hover:text-gray-700 dark:hover:text-white">
                <Github size={24} />
              </Link>
            </div>
          </div>
        </Fade>
      </div>
    </main>
  );
}
