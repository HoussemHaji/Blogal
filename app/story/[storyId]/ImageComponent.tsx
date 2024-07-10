"use client"
import React from 'react';


const ImageComponent = ({ imageUrl, file }: { imageUrl: string, file: File }) => {
    return (
        <div className='py-3'>
            <div>
                <img src={imageUrl} alt="Image" className='max-w-full h-[450px]' />
                <div className='text-center text-sm max-w-md mx-auto'>
                    <p
                        data-p-placeholder='Type caption for your image'
                    >

                    </p>
                </div>
            </div>
            <p data-p-placeholder='...'></p>
        </div>
    )

}

export default ImageComponent