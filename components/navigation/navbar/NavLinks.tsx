"use client"

import React from 'react'
import {usePathname} from "next/navigation";
import {SidebarLinks} from "@/constants/SidebarLinks";
import Image from "next/image";
import Link from "next/link";
import {cn} from "@/lib/utils";

import {SheetClose} from "@/components/ui/sheet";

interface SidebarLinkProps {
    title: string,
    href: string,
    icon: string
}

const NavLinks = ({isMobileNav = false}: { isMobileNav?: boolean }) => {
    const pathname = usePathname()
    const userId = 1; // ! Temporary

    return (
        <>
            {SidebarLinks.map((link: SidebarLinkProps) => {
                const isActive = (pathname.includes(link.href) && link.href.length > 1) || (pathname === link.href)
                if (link.href === '/profile') {
                    if (userId) link.href = `/profile/${userId}`
                    else return null
                }

                const LinkComponent = (
                    <Link href={link.href} key={link.title}
                          className={cn(isActive
                                  ? 'primary-gradient rounded-lg text-light-900'
                                  : 'text-dark300_light900',
                              "flex items-center justify-start gap-4 bg-transparent p-4 max-lg:justify-center overflow-hidden ")}
                    >
                        <Image src={link.icon} alt={link.title} width={20} height={20} className={cn({"invert-colors": !isActive})}/>
                        <p className={cn(isActive ? 'base-bold' : 'base-medium', !isMobileNav && 'max-lg:hidden')}>{link.title}</p>
                    </Link>
                )

                return isMobileNav ? (
                        <SheetClose asChild key={link.href}>
                            {LinkComponent}
                        </SheetClose>
                    ) :
                    <React.Fragment key={link.href}>
                        {LinkComponent}
                    </React.Fragment>
            })}
        </>
    )
}
export default NavLinks
