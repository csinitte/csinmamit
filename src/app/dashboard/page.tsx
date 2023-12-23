import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation';

const Dashboard = async () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()
  if (!user || !user.id) redirect('/auth-callback?origin=dashboard')

  return(
    <>{user.email}</>
  );
};

export default Dashboard;
