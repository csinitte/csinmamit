

import Dashboard from '@/components/Dashboard'
import { db } from '@/db'

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import AddTeam from "@/components/AddTeam"


const Add = async () => {
    const { getUser } = getKindeServerSession()
    const user = getUser()
  
    if (!user || !user.id) redirect('/')
  

  return (
    <AddTeam/>
  )
}

export default Add