import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    UserId: string
    createdAt: Date
}

const AuthorBadge = ({ UserId, createdAt }: Props) => {
    const [User, setUser] = useState<any>()

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/getUser?userId=${UserId}`)
                const data = await response.json()
                setUser(data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchUser()
    }, [UserId])

    const calculateDaysAgo = (createdAt: Date) => {
        const currentDate = new Date()
        const createdDate = new Date(createdAt)
        const timeDifference: number = currentDate.getTime() - createdDate.getTime()

        const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24))

        return daysAgo
    }

    if (!User) return null

    return (
        <div className='px-4 text-sm'>
            <div className='flex items-center space-x-3'>
                <Image
                    src={User?.imageUrl ? User.imageUrl : "/no-image.jpg"}
                    width={32}
                    height={32}
                    alt='User'
                    className='rounded-full object-cover'
                    priority
                />
                <div>
                    <p>{User?.firstName} {User?.lastName}</p>
                    <p className='text-xs opacity-60'>{calculateDaysAgo(createdAt)} days ago</p>
                </div>
            </div>
        </div>
    )
}

export default AuthorBadge
