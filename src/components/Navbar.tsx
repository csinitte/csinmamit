import React from 'react'

import Link from 'next/link';
import MaxWidthWrapper from './MaxWidthWrapper';
import { buttonVariants } from './ui/button';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs/server';
import { ArrowRight } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className='sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg translate-all'>
        <MaxWidthWrapper>
            <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
                <Link href='/' className="flex z-40 font-semibold">
                    <span>CSI.</span>
                </Link>

                <div className='hidden items-center space-x-4 sm:flex'>
                    <>
                        <Link 
                        href={'/dashboard'}
                        className={buttonVariants({variant: "ghost", size: 'sm'})}>
                            Home
                        </Link>
                        <LoginLink
                  className={buttonVariants({
                    variant: 'ghost',
                    size: 'sm',
                  })}>
                  Sign in
                </LoginLink>
                <RegisterLink
                  className={buttonVariants({
           
                    size: 'sm',
                  })}>
                  Get Started <ArrowRight/>
                </RegisterLink>
                        
                    </>
                </div>
            </div>
        </MaxWidthWrapper>
    </nav>
  )
}

export default Navbar