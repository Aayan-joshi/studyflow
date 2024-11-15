import React from 'react'

import {Button} from "@/components/ui/button";

import {
    Sheet, SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import NavLinks from "@/components/navigation/navbar/NavLinks";


const MobileNavigation = () => {
    return (
        <Sheet>
            <SheetTrigger>
                <Image src={`/icons/hamburger.svg`} width={36} height={36} alt={`menu`} className={`invert-colors sm:hidden`}/>
            </SheetTrigger>
            <SheetContent className={`background-light900_dark200 border-none`} side={`left`}>
                <SheetTitle className={`hidden`}>Navigation</SheetTitle>
                <Link href={`/`} className={`flex items-center gap-1`}>
                <Image src={`/images/site-logo.svg`} width={23} height={23} alt={`Logo`} className={`translate-y-1`}/>
                <p className={`h2-bold font-space-grotesk test-dark-100 dark:text-light-900`}>
                    Study<span className={`text-primary-500`}>Flow</span>
                </p>
                </Link>

                <div className={`no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto`}>
                    <SheetClose asChild>
                        <section className={`flex h-full flex-col gap-6 pt-16`}>
                            <NavLinks isMobileNav/>
                        </section>
                    </SheetClose>

                    <div className={`flex flex-col gap-3`}>
                        <SheetClose asChild>
                            <Link href={ROUTES.SIGN_IN}>
                                <Button className={`small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none`}>
                                    <span className={`primary-text-gradient`}>Log In</span>
                                </Button>
                            </Link>
                        </SheetClose>

                        <SheetClose asChild>
                            <Link href={ROUTES.SIGN_IN}>
                                <Button className={`small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none`}>
                                    Sign Up
                                </Button>
                            </Link>
                        </SheetClose>
                    </div>
                </div>
            </SheetContent>
        </Sheet>

    )
}
export default MobileNavigation