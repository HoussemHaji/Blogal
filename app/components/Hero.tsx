import React from 'react'

type Props = {}

function Hero({ }: Props) {
    return (
        <div className=' bg-[url("/banner.jpg")] h-[500px] w-full bg-cover bg-no-repeat'>
            <div className='bg-black bg-opacity-50 h-full flex flex-col w-full gap-5 justify-center items-center'>
                <div className='text-white text-5xl font-bold text-center'>
                    Welcome to Blogal
                </div>
                <p className='text-white text-lg font-semibold'>Where you can write your stories and thoughts</p>
            </div>
        </div>
    )
}

export default Hero