"use client"
import { Repeat, Repeat2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

type Props = {}

function ShareComponent({ }: Props) {
    const [showPopup, setShowPopup] = React.useState(false)
    const pathname = usePathname()
    return (
        <div className='relative'>
            <button onClick={() => setShowPopup(!showPopup)}>

                {showPopup ? <Repeat width={20} height={20} stroke='#3FA2F6' strokeWidth={0.75} /> : <Repeat width={20} height={20} strokeWidth={0.75} />}
            </button>
            {showPopup && (
                <div className='w-[250px] h-[100px] flex flex-col justify-around rounded-md shadow-lg absolute bottom-12 -left-20'>
                    <input value={`${process.env.NEXT_PUBLIC_URL}${pathname}`} className='overflow-hidden mx-2 p-2 border-[1px] rounded-md bg-gray-100 ' />
                    <button onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}${pathname}`)} className='text-center w-full py-2'>
                        Copy Link
                    </button>
                </div>
            )}
        </div>
    )
}

export default ShareComponent