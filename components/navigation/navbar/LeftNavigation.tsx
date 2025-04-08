import React from 'react';
import NavLinks from '@/components/navigation/navbar/NavLinks';
import Link from 'next/link';
import Image from 'next/image';
import ROUTES from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';
import { signOut } from '@/auth';

const LeftNavigation = ({ session }: { session: Session | null }) => {
    const userId = session?.user?.id;

    return (
        <section
            className={cn(
                'custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]'
            )}
        >
            {/* Navigation Links */}
            <div className="flex flex-1 flex-col gap-6">
                <NavLinks />
            </div>

            {/* Authentication Buttons */}
            {!userId ? (
                <div className="flex flex-col gap-3">
                    <Link href={ROUTES.SIGN_IN}>
                        <Button className="small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none">
                            <Image
                                src="/icons/account.svg"
                                alt="Account"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="primary-text-gradient max-lg:hidden">Log In</span>
                        </Button>
                    </Link>

                    <Link href={ROUTES.SIGN_UP}>
                        <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
                            <Image
                                src="/icons/sign-up.svg"
                                alt="SignUp"
                                width={20}
                                height={20}
                                className="invert-colors lg:hidden"
                            />
                            <span className="max-lg:hidden">Sign Up</span>
                        </Button>
                    </Link>
                </div>
            ) : (
                <div>

                    <form action={
                        async () => {
                            "use server"

                            await signOut()
                        }
                    }>
                        <Button
                            className="small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none"
                        >
                            <Image
                                src="/icons/logout.svg"
                                alt="Logout"
                                width={20}
                                height={20}
                                className="invert-colors"
                            />
                            <span className="primary-text-gradient max-lg:hidden">Log out</span>
                        </Button>
                    </form>
                </div>
            )}
        </section>
    );
};

export default LeftNavigation;
