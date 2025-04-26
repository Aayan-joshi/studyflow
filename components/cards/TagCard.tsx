import React from 'react';
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { getDevIconClassName } from "@/lib/utils";
import Image from "next/image";	

interface Props {
    _id: string;
    name: string;
    questions?: number;
    showCount?: boolean;
    compact?: boolean;
    remove?: boolean;
    isButton?: boolean;
    handleRemove?: () => void;
}

const TagCard = ({ _id, name, questions, showCount = false, compact = false, remove, isButton, handleRemove }: Props) => {
    const iconClass = getDevIconClassName(name)

    const Content = (
        <>
            <Badge className={`subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase flex flex-row items-center gap-2`}>
                <div className={`flex-center space-x-2`}>
                    <i className={`${iconClass} text-sm`}></i>
                    <span>{name}</span>
                </div>


                {remove && (
                    <Image
                        src="/icons/close.svg"
                        alt="remove"
                        width={12}
                        height={12}
                        onClick={handleRemove}
                        className={`cursor-pointer object-contain invert-0 dark:invert`}
                    />
                )}
            </Badge>
            {showCount && (<p className={`small-medium text-dark500_light700`}>{questions}</p>)}
            </>
    )

    if(compact) {
        if (isButton) {
            return <button type='button' className={`flex justify-between gap-2`} onClick={(e)=> e.preventDefault()}>{Content}</button>
        } else {
        return (
            <Link href={ROUTES.TAGS(_id)} className={`flex justify-between gap-2`}>
                {Content}
            </Link>
        );
    }
};
}

export default TagCard;