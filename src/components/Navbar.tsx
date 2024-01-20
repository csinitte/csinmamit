import Link from 'next/link'
import MaxWidthWrapper from './MaxWidthWrapper'
import { buttonVariants } from './ui/button'
import {
  LoginLink,
  RegisterLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server'
import { ArrowRight } from 'lucide-react'
import UserAccountNav from './UserAccountNav'
import MobileNav from './MobileNav'
import Image from 'next/image'

import { Button } from "@/components/ui/button"

const Navbar = () => {
  const { getUser } = getKindeServerSession()
  const user = getUser()


  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all dark:bg-black'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
        
          <Link
            href='/'
            className='flex z-40 font-semibold'>
              <div className='flex h-14 items-center justify-between gap-5'>
              <Image src="/csi-logo.png" alt="CSI Logo" width={30} height={30} />
              <span className='text-blue-600 '>Computer Society of India.</span>
              </div>
              
            
          </Link>

          <MobileNav isAuth={!!user} />

          <div className='hidden items-center space-x-4 sm:flex'>
            {!user ? (
              <>
                              <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Home
                </Link>
                <Link
                  href='/events'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Events
                </Link>
                <Link
                  href='/team'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Team
                </Link>
                <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Log In
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
                    size: 'sm',
                  })}>
                  Join Us{' '}
                  <ArrowRight className='ml-1.5 h-5 w-5' />
                </RegisterLink>
                {/* <Button variant="outline" size="icon">
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button> */}
              </>
            ) : (
              <>
                                <Link
                  href='/dashboard'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Home
                </Link>
                <Link
                  href='/events'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Events
                </Link>
                <Link
                  href='/team'
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Team
                </Link>

                <UserAccountNav
                  name={
                    !user.given_name || !user.family_name
                      ? 'Your Account'
                      : `${user.given_name} ${user.family_name}`
                  }
                  email={user.email ?? ''}
                  imageUrl={user.picture ?? ''}
                />
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar