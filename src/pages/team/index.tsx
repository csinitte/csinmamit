import { useEffect, useState } from "react";
import { FacultyList } from "~/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MaxWidthWrapper from "~/components/layout/max-width-wrapper";
import Loader from "~/components/ui/loader";
import localFont from "next/font/local";
import { Faculty } from "~/components/team/faculty-cards";
import { Fade } from "react-awesome-reveal";
// import { coremem } from "~/data/core";
import { TeamMember } from "~/components/team/team-cards";
// import { api } from "~/utils/api"; 
const myFont = localFont({ src: "../../pages/obscura.otf" });
import { CoreMembers } from "~/components/team/team-data"; // Importing static core members data
// Static list of core team members (manually maintained).
// Update or add team members here as needed.

// const roleOptions = [
//   "Chairman",
//   "Vice Chairman",
//   "Secretary",
//   "Treasurer",
//   "Joint Secretary",
//   "Student Advisor",
//   "Program Committee Head",
//   "Program Committee Co-Head",
//   "Social Media Head",
//   "Web Editor Head",
//   "Web Editor Co-Head",
//   "MC Committee Head",
//   "MC Committee Co-Head",
//   "Graphic Committee Head",
//   "Graphic Committee Co-Head",
//   "Magazine Committee Head",
//   "Magazine Committee Co-Head",
//   "Photography Committee Head",
//   "Photography Committee Co-Head",
//   "Android Domain Head",
//   "Android Domain Co-Head",
//   "Web Domain Head",
//   "Web Domain Co-Head",
//   "AIML Domain Head",
//   "AIML Domain Co-Head",
//   "CyberSecurity Domain Head",
//   "CyberSecurity Domain Co-Head",
//   "Final Year Representative",
//   "Third Year Representative",
//   "Second Year Representative",
// ];

export interface CoreMember {
  // email: string | null;
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
  useEffect(() => {
    // Simulate loading delay with setTimeout
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the delay time as needed (in milliseconds)

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
  }, []); // Empty dependency array to run only once on component mount

  // Removed backend query (api.core.getCoreMembers) since we now use a static CoreMembers array.
  // Uncomment the following line if you want to fetch team members from the backend.
  // Note: Ensure the backend API is set up to return the correct data structure.

  // const { data: teamMembers } = api.core.getCoreMembers.useQuery(); 

  return (
    <MaxWidthWrapper className="mb-12 mt-6 sm:mt-9 lg:mt-12 flex flex-col items-center justify-center text-center px-4 sm:px-6">
      <Fade triggerOnce cascade>
        <div className="mb-6 sm:mb-10 mt-6 sm:mt-10">
          <h1
            className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-6 sm:pt-10 text-center text-3xl sm:text-4xl lg:text-6xl font-black text-transparent underline-offset-2 `}
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
                    {/* Uncomment the following lines to fetch team members from the backend API.
                    Note: Ensure the backend API is set up to return the correct data structure. */}
                    {/* {teamMembers &&
                      teamMembers
                      .sort((a, b) => a.order - b.order)
                      .map((member, index) => (
                        <TeamMember key={index} {...member} />
                    ))} */}

                    {/* Rendering core team members from static array.
                    Sorted by custom `order` field to maintain display order */}

                    {CoreMembers.sort((a, b) => a.order - b.order).map((member, index) => (
                      <TeamMember key={index} {...member} />
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


