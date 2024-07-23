/* eslint-disable react/no-unescaped-entities */
import React from 'react'

type Props = {}

function Hero({ }: Props) {
    return (
        <div>
            <div className=' bg-[url("/banner.jpg")] h-[450px]  bg-cover bg-no-repeat max-w-screen-2xl '>
                <div className='bg-black bg-opacity-50 h-full flex flex-col w-full gap-5 justify-center items-center'>
                    <div className='text-white text-5xl font-bold text-center'>
                        Welcome to Blogal
                    </div>
                    <p className='text-white text-lg font-semibold'>Where you can write your stories and thoughts</p>
                </div>
            </div>
            <div className='max-w-[1100px] mx-auto mt-20 flex flex-col gap-2'>
                <h1 className='text-3xl font-bold font-mono'>
                    Write your first Blog post now!
                </h1>
                <p className='font-mono text-sm font-medium'>
                    Whether you're here to explore the latest trends, uncover new ideas, or gain fresh perspectives, our blog is your go-to destination. Join us on this journey of discovery and stay ahead of the curve with engaging content curated just for you. Happy reading!
                </p>
            </div>
        </div>
    )
}

export default Hero