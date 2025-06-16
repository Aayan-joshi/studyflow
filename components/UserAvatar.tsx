import ROUTES from '@/constants/routes'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'


export interface Props {
    id: string
    name: string
    imageUrl?: string
    fallbackClassName?: string
    className?: string
}

const UserAvatar = ({
    id,
    name="Anonymous",
    imageUrl, 
    fallbackClassName, 
    className = 'h-9 w-9'}: Props) => {

    const initials = name!.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={ROUTES.PROFILE(id)}>
        <Avatar className={className}>
            {imageUrl ? (
                <Image 
                    src={imageUrl}
                    alt={name!}
                    className={`object-cover`}
                    width={36}
                    height={36}
                    quality={100}
                />
            )
        : (
            <AvatarFallback
            className={cn('primary-gradient font-spaceGrotesk font-bold tracking-wider text-white', fallbackClassName)}
            >
                {initials}
            </AvatarFallback>
        )}
        </Avatar>
    </Link>
  )
}

export default UserAvatar