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
    <MaxWidthWrapper className="mb-12 mt-9 flex flex-col items-center justify-center text-center sm:mt-12">
      <Fade triggerOnce cascade>
        <div className="mb-10 mt-10">
          <h1
            className={`${myFont.className} bg-gradient-to-b from-pink-600 to-violet-400 bg-clip-text pt-10 text-center text-6xl font-black text-transparent underline-offset-2 `}
          >
            Meet the Team
          </h1>
          <p className="sm-text-lg mt-5 max-w-prose font-semibold text-zinc-700 underline">
            CSI NMAMIT - 2025
          </p>
          <div className="mb-5 mt-5"></div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            <Tabs defaultValue="team">
              <TabsList>
                <TabsTrigger value="fac">Faculty</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>
              <TabsContent value="fac">
                {/* <h2 className="mt-4 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                  Faculty
                </h2> */}
                <div className="mt-10 flex flex-wrap justify-center gap-20 pb-10">
                  {FacultyList.map((member, index) => (
                    <Faculty key={index} {...member} />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="team">
                {/* <h2 className="mt-4 bg-gradient-to-r from-blue-400 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
                  Team
                </h2> */}
                <div className="mt-10 flex flex-wrap justify-center gap-20 pb-10">
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


