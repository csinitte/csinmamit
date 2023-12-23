import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

const Dashboard = () => {
  
  const fetchUser = async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    console.log(user);

    if (user) {
      console.log('User Email:', user.given_name);
    } else {
      console.log('User not logged in');
    }
  };

  // Call the function to fetch and log user information
  fetchUser();

  return <div></div>;
};

export default Dashboard;
