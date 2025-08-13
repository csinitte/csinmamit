import { useEffect, useState } from "react";
import { FacultyList } from "~/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import Loader from "~/components/ui/loader";
import { Faculty } from "~/components/team/faculty-cards";
import { Fade } from "react-awesome-reveal";
import { TeamMember } from "~/components/team/team-cards";
import { CoreMembers } from "~/components/team/team-data"; // Importing static core members data

export interface CoreMember {
  name: string;
  branch: string;
  position: string;
  linkedin: string | null;
  github: string | null;
  imageSrc: string;
  year: number;
  order: number;
}

export default function Team() {
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = CoreMembers.map((member) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = member.imageSrc;
          img.onload = () => {
            setImagesLoaded(prev => prev + 1);
            resolve(true);
          };
          img.onerror = () => resolve(false);
        });
      });

      await Promise.all(imagePromises);
      setLoading(false);
    };

    void preloadImages();
  }, []);

  // Removed backend query (api.teamMembers.getAll.useQuery) to avoid errors.
  // Using static CoreMembers array for display.

  return (
    <MaxWidthWrapper className="mb-12 mt-6 sm:mt-9 lg:mt-12 flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <Fade triggerOnce cascade>
        <div className="mb-6 sm:mb-10 mt-6 sm:mt-10">
          <h1
            className="bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-6 sm:pt-10 text-center text-3xl sm:text-4xl lg:text-6xl font-black text-transparent underline-offset-2"
          >
            Meet the Team
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mt-3 sm:mt-5 max-w-prose font-semibold text-zinc-700 underline">
            CSI NMAMIT - 2025
          </p>
          <div className="mb-3 sm:mb-5 mt-3 sm:mt-5"></div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <Tabs defaultValue="team" className="w-full max-w-6xl">
              <TabsList className="grid w-full grid-cols-2 max-w-[300px] mx-auto">
                <TabsTrigger value="fac" className="text-xs sm:text-sm">Faculty</TabsTrigger>
                <TabsTrigger value="team" className="text-xs sm:text-sm">Team</TabsTrigger>
              </TabsList>
              <TabsContent value="fac">
                <div className="mt-6 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-20 pb-6 sm:pb-10">
                  {FacultyList.map((member, index) => (
                    <Faculty key={index} {...member} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="team">
                <div className="mt-6 sm:mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-10 xl:gap-20 pb-6 sm:pb-10">
                  {CoreMembers.sort((a, b) => a.order - b.order).map((member, index) => (
                    <TeamMember key={index} {...member} _year={member.year} _order={member.order} />

                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Fade>
    </MaxWidthWrapper>
  );
}
