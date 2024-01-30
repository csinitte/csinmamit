import { useEffect } from 'react';
import MyProfileTabs from '../profile/MyProfileTabs';
import { db } from '@/db';
import AnimatedGradientText from '../AnimatedGradientText';
import { trpc } from '@/app/_trpc/client';

interface ProfProps {
  username: string;
}

const OtherProfile: React.FC<ProfProps> = ({ username }) => {
  // Fetch member data
  const { data: userData, error } = trpc.getProfile.useQuery({ username });

  useEffect(() => {
    // Additional actions you might want to perform on component mount
    // ...

    // Cleanup function (if needed) for when the component unmounts
    return () => {
      // Cleanup actions
      // ...
    };
  }, [username]);

  if (error) {
    console.error('Error fetching user data:', error);
    return (
      <AnimatedGradientText>
        No Data Found
      </AnimatedGradientText>
    );
  }

  if (!userData) {
    return (
      <AnimatedGradientText>
        No Data Found
      </AnimatedGradientText>
    );
  }

  const { name, pfp, bio, branch, role, github, linkedin, phonenumber } = userData;

  return (
    <>
      <MyProfileTabs
        name={name || ""}
        usn={""}
        username={username}
        pfp={pfp || "/mock.png"}
        bio={bio || ""}
        branch={branch || ""}
        github={github || ""}
        linkedin={linkedin || ""}
        role={role}
        phonenumber={phonenumber || ""}
      />
      {/* Additional rendering or usage of userData as needed */}
    </>
  );
};

export default OtherProfile;
