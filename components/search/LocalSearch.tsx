"use client";

import React, {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {useSearchParams, useRouter, usePathname} from "next/navigation";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/url";

interface Props {
    imgSrc: {
        src: string;
        alt: string;
    },
    placeholder: string,
    otherClasses?: string,
    route?: string,
    iconPosition?: 'left' | 'right';
}

const LocalSearch = ({imgSrc, placeholder, otherClasses, route, iconPosition="left"}: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const searchParams = useSearchParams()
    const query = searchParams.get('query') || "";

    const [searchQuery, setSearchQuery] = useState(query)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: 'query',
                    value: searchQuery
                })
                router.push(newUrl, {scroll: false})
            } else {
                if(pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ['query'],
                    })

                    router.push(newUrl, {scroll: false})
                }
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, router, route, searchParams, pathname]);

    return (
        <div className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4`}>
            {iconPosition === 'left' && (                  
            <Image
                src={imgSrc.src}
                width={24}
                height={24}
                alt={imgSrc.alt}
                className={`cursor-pointer`}
            />

            )}
            <Input
                type={`text`}
                placeholder={placeholder}
                className={`w-full paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none ${otherClasses}`}
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value)}}/>
            
            {iconPosition === 'right' && (                  
            <Image
                src={imgSrc.src}
                width={15}
                height={15}
                alt={imgSrc.alt}
                className={`cursor-pointer`}
            />

            )}
        </div>
    );
};

export default LocalSearch;