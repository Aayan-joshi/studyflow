import ROUTES from '@/constants/routes'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'

const UserAvatar = ({session, className = 'h-9 w-9'}: {session: Session | null, className?: string}) => {

    const {name, id, image:imageUrl} = session?.user || {}

    const initials = name!.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <Link href={ROUTES.PROFILE(id!)}>
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
            className='primary-gradient font-spaceGrotesk font-bold tracking-wider text-white'
            >
                {initials}
            </AvatarFallback>
        )}
        </Avatar>
    </Link>
  )
}

export default UserAvatar