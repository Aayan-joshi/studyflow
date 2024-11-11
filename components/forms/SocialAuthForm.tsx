'use client'

import ROUTES from "@/constants/routes";
import React from 'react'
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {toast} from "@/hooks/use-toast";
import {signIn} from "next-auth/react";

const SocialAuthForm = () => {

    const ButtonClass = "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 px-4 py-3.5 rounded-2"

    const handleSignIn = async (provider: "github" | "google") => {
        try {
            // await signIn(provider)
            await signIn(provider, {
                callbackUrl: ROUTES.HOME,
                redirect: false,
            })
        } catch (error) {
            console.error(error)

            toast({
                title: "Sign In Failed",
                description:
                    error instanceof Error
                    ? error.message
                    : "An unexpected error occurred. Please try again.",
                variant: "destructive",
            })
        }
    }
    return (
        <div className={`mt-10 flex flex-wrap gap-2.5`}>
            <Button className={ButtonClass} onClick={()=> handleSignIn('github')}>
                <Image
                    src={`/icons/github.svg`}
                    alt={`Github Logo`}
                    height={20}
                    width={20}
                    className={`invert-colors mr-2.5 object-contain`}
                />
                <span>Log In with Github</span>
            </Button>
            <Button className={ButtonClass} onClick={()=> handleSignIn('google')}>
                <Image
                    src={`/icons/google.svg`}
                    alt={`Google Logo`}
                    height={20}
                    width={20}
                    className={`mr-2.5 object-contain`}
                />
                <span>Log In with Google</span>
            </Button>
        </div>
    )
}
export default SocialAuthForm
