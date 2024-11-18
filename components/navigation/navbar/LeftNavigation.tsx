"use client"

import React, {useState, useEffect} from 'react'
import NavLinks from "@/components/navigation/navbar/NavLinks";
import Link from "next/link";
import Image from "next/image";
import ROUTES from "@/constants/routes";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {signOut} from "next-auth/react"



const LeftNavigation = ({session} : {session: object | null} ) => {

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    useEffect(() => {
            if(!session) {
                setIsLoggedIn(false)
            }
    }, [session]);

    return (
            <section className={`custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 h-screen flex flex-col justify-between overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]`}>

                        <div className={`flex flex-1 flex-col gap-6`}>
                            <NavLinks/>
                        </div>


                        <div className={cn(isLoggedIn ? "hidden" : "flex flex-col gap-3")}>

                            <Link href={ROUTES.SIGN_IN}>
                                <Button className={`small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none`}>
                                    <Image src={`/icons/account.svg`} alt={`Account`} width={20} height={20} className={`invert-colors lg:hidden`}/>
                                    <span className={`primary-text-gradient max-lg:hidden`}>Log In</span>
                                </Button>
                            </Link>



                            <Link href={ROUTES.SIGN_UP}>
                                <Button className={`small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none`}>
                                    <Image src={`/icons/sign-up.svg`} alt={`SignUp`} width={20} height={20} className={`invert-colors lg:hidden`}/>
                                    <span className={`max-lg:hidden`}>Sign Up</span>
                                </Button>
                            </Link>

                        </div>

                        <div>
                            {/*<SignOut setIsLoggedIn={setIsLoggedIn} ButtonClassName={"small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none"}/>*/}
                            <Button onClick={()=>{
                                signOut().then(()=>setIsLoggedIn(false));
                            }}
                                    className={cn(isLoggedIn ? "flex" : "hidden", "small-medium btn-secondary min-h-[41px] w-full px-4 rounded-lg py-3 shadow-none")}
                            >
                                <Image src={`/icons/logout.svg`} alt={`Logout`} width={20} height={20} className={`invert-colors`}/>
                                <span className={`primary-text-gradient max-lg:hidden`}>Log out</span>
                            </Button>
                        </div>

            </section>
    )
}
export default LeftNavigation
