'use client'

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/url";
import {cn} from "@/lib/utils";

const filters = [
    {name: "React", value: "react"},
    {name: "Javascript", value: "javascript"},
    // {name: "Latest", value: "latest"},
    // {name: "Trending", value: "trending"},
    // {name: "Most Viewed", value: "most-viewed"},
    // {name: "Most Answered", value: "most-answered"},
    // {name: "Unanswered", value: "unanswered"},
    // {name: "Recommended", value: "recommended"},
]

const HomeFilter = () => {

    const router = useRouter()


    const searchParams = useSearchParams()
    const filterParams = searchParams.get('filter') || "";

    const [active, setActive] = useState(filterParams)

    useEffect(() => {
        if (active) {
            setActive(active)
            const newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'filter',
                value: active
            })
            router.push(newUrl, {scroll: false})
        }
    }, [])

    const handleFilterUpdate = (filter: string) => {
        let newUrl = "";
        if (filter === active) {
            setActive("")

            newUrl = removeKeysFromQuery({
                params: searchParams.toString(),
                keysToRemove: ['filter'],
            })
        } else {
            setActive(filter)

            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: 'filter',
                value: filter
            })
        }
            router.push(newUrl, {scroll: false})
    }
    

    return (
        <div className={`mt-10 hidden flex-wrap gap-3 sm:flex`}>
            {
                filters.map((filter) => (
                    <Button key={filter.name} className={
                        cn(`body-medium rounded-lg px-6 py-3 capitalize shadow-none`,
                            active === filter.value
                                ? `bg-primary-100 
                                text-primary-500 
                                hover:bg-primary-100 
                                dark:bg-dark-400 
                                dark:text-primary-500 
                                dark:hover:bg-dark-400`
                                : `bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:hover:bg-dark-300`, `hover:bg-primary hover:text-white dark:text-light-500`)} onClick={() => handleFilterUpdate(filter.value)}>
                        {filter.name}
                    </Button>
                ))
            }
        </div>
    );
};

export default HomeFilter;