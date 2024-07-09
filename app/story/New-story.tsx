"use client"
import { Plus, Image, MoreHorizontal, Code } from 'lucide-react'
import React, { useEffect } from 'react'
import './new_story.css'

type Props = {}

const NewStory = (props: Props) => {

    const contentEditable = React.useRef<HTMLDivElement | null>(null)
    const [openTools, setOpenTools] = React.useState(false);
    const [buttonPosition, setButtonPosition] = React.useState<{ top: number, left: number }>({ top: 0, left: -10 })

    const getCaretPosition = () => {
        let x = 0, y = 0;
        let isSupported = typeof window.getSelection !== "undefined";
        if (isSupported) {
            let selection = window.getSelection() as Selection;
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0).cloneRange();
                const rect = range.getClientRects()[0];
                if (rect) {
                    let x = rect.left
                    let y = rect.top + window.scrollY - 100
                    return { x, y }
                }


            }
        }

        return { x, y }

    }


    useEffect(() => {
        const handleInput = () => {
            const { x, y } = getCaretPosition()
            setButtonPosition({ top: y, left: -40 })
            // console.log(x, y)
            // console.log(buttonPosition)

        }

        contentEditable.current?.addEventListener('input', handleInput)
    }, [])

    const handleOpenTools = () => {
        setOpenTools(!openTools)
    }

    return (

        <main id='container' className='max-w-[800px] mx-auto relative font-mono mt-5'>
            <div id='editable' ref={contentEditable} contentEditable suppressContentEditableWarning className='outline-none focus:outline-none max-w-[800px] flex flex-col gap-4 p-5' style={{ whiteSpace: "pre-line" }}>
                <h1 className='font-medium text-gray-800 text-3xl' data-h1-placeholder='New Story Title' ></h1>
                <p className='font-normal text-gray-700 text-base' data-p-placeholder="Write Your Story"></p>
            </div>

            <div className={` z-10 absolute ${buttonPosition.top === 0 ? "hidden" : ""} `} style={{ top: buttonPosition.top, left: buttonPosition.left }}>
                <button id='tooltip' onClick={handleOpenTools} className='rounded-full border-[1px] border-neutral-500 p-1 inline-block'>
                    <Plus className={`duration-300 ease-linear font-extralight  ${openTools ? "rotate-90" : ""} `} />

                </button>
                <div id='tool' className={`flex items-center space-x-4 absolute top-0 left-14 ${openTools ? "visible" : "invisible"}`}>
                    <span className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>
                        <Image className='opacity-60 text-gray-800  ' size={20} />
                        <input type="file" accept='image/*' style={{ display: 'none' }} />

                    </span>
                    <span className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>
                        <MoreHorizontal className='opacity-60 text-gray-800 ' size={20} />
                        <input type="file" accept='image/*' style={{ display: 'none' }} />

                    </span>
                    <span className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>
                        <Code className='opacity-60 text-gray-800 ' size={20} />
                        <input type="file" accept='image/*' style={{ display: 'none' }} />

                    </span>
                </div>

            </div>



        </main>
    )
}

export default NewStory