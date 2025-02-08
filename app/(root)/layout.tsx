import React, {ReactNode} from 'react'
import Navbar from "@/components/navigation/navbar";
import LeftNavigation from "@/components/navigation/navbar/LeftNavigation";
import {auth} from "@/auth";
import RightSidebar from "@/components/navigation/navbar/RightSidebar";


const RootLayout = async ({children}: { children: ReactNode }) => {
    const session = await auth() || null
    if (session) {
        console.log(session)
    }

    return (
        <main>
            <Navbar/>
            <div className={`flex`}>
                <LeftNavigation session={session}/>
                {/*<section className={`absolute h-full bg-light-700 dark:bg-dark-100 w-[calc(100vw-266px)] max-lg:w-[calc(100vw-112px)] max-sm:w-full right-0 mt-24 p-10`}>*/}
                <section className={`flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 max-sm:px-14`}>
                    <div className={`mx-auto w-full max-w-5xl`}>
                        {children}
                    </div>

                </section>
                <RightSidebar/>
            </div>
        </main>
    )
}
export default RootLayout
