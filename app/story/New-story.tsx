/* eslint-disable @next/next/no-img-element */
"use client"
import { Plus, Image, MoreHorizontal, Code, ClipboardPasteIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import MediumEditor from 'medium-editor'
import 'medium-editor/dist/css/medium-editor.css'
import 'medium-editor/dist/css/themes/default.css'
import './new_story.css'
import { createRoot } from 'react-dom/client'
import hljs from 'highlight.js'
import "highlight.js/styles/github.css"
import axios from 'axios'
import { CldUploadWidget, getCldImageUrl } from 'next-cloudinary';

type Props = {
    storyId: string,
    StoryContent: string | undefined | null
}

const NewStory = ({ storyId, StoryContent }: Props) => {
    const contentEditable = useRef<HTMLDivElement | null>(null)
    const [openTools, setOpenTools] = useState(false);
    const fileInput = useRef<HTMLInputElement | null>(null)

    const [buttonPosition, setButtonPosition] = useState<{ top: number, left: number }>({ top: 0, left: -10 })
    const [images, setImages] = useState<Array<{ imageUrl: string, file: File }>>([])
    const [imageUrl, setImageUrl] = useState<string>('')
    const [saving, setSaving] = useState(false)

    const inputImage = () => {
        fileInput.current?.click()
    }

    const getCaretPosition = () => {
        let x = 0, y = 0;
        let isSupported = typeof window.getSelection !== "undefined";
        if (isSupported) {
            let selection = window.getSelection() as Selection;
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0).cloneRange();
                const rect = range.getClientRects()[0];
                if (rect) {
                    x = rect.left;
                    y = rect.top + window.scrollY - 100;
                    return { x, y };
                }
            }
        }
        return { x, y }
    }

    useEffect(() => {
        const handleInput = () => {
            const { x, y } = getCaretPosition()
            setButtonPosition({ top: y, left: -40 })
            debouncedHandleSave()
        }
        contentEditable.current?.addEventListener('input', handleInput)
    }, [])

    useEffect(() => {
        if (typeof window.document !== 'undefined') {
            const editor = new MediumEditor('#editable', {
                elementsContainer: document.getElementById('container') as HTMLElement,
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'quote']
                }
            })
            return () => {
                editor?.destroy()
            }
        }
    }, [])


    function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
        return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    const debouncedHandleSave = useRef(
        debounce(() => {
            handleSave();
        }, 1000)
    ).current;

    const handleSave = async () => {
        const content = contentEditable.current?.innerHTML
        setSaving(true)
        try {
            await axios.patch('/api/new-story', {
                storyId,
                content
            })
            console.log('saved')
        } catch (error) {
            console.log('Error in saving')
        }
        setSaving(false)
    }

    const handleOpenTools = () => {
        setOpenTools(!openTools)
    }

    const handleFileUploadSuccess = (result: any) => {
        setOpenTools(false)
        const publicId = result?.info?.public_id;
        const newImageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${publicId}`;
        console.log("New Image URL:", newImageUrl);
        setImageUrl(newImageUrl);
        setImages([...images, { imageUrl: newImageUrl, file: result?.info }]);
    }


    const addDivider = () => {
        const divider = <Divider />
        setOpenTools(false)
        const wrapperDiv = document.createElement('div')
        const root = createRoot(wrapperDiv)
        root.render(divider)
        contentEditable.current?.appendChild(wrapperDiv)
        handleSave()
    }

    const insertCodeBlock = () => {
        const codeBlock = <CodeBlock />
        setOpenTools(false)
        const wrapperDiv = document.createElement('div')
        const root = createRoot(wrapperDiv)
        root.render(codeBlock)
        contentEditable.current?.appendChild(wrapperDiv)
    }

    return (
        <main id='container' className='max-w-[800px] mx-auto relative font-mono mt-8'>
            <p className='absolute -top-[90px] lg:-left-44 sm:ml-10 ml-5 opacity-30  z-40'> {saving ? "saving..." : "saved"} </p>
            <div id='editable' ref={contentEditable} contentEditable suppressContentEditableWarning className='outline-none focus:outline-none max-w-[800px]  p-5 prose' style={{ whiteSpace: "pre-line" }}>
                {StoryContent ? (
                    <div dangerouslySetInnerHTML={{ __html: StoryContent }}></div>
                ) : (
                    <>
                        <h1 className='font-medium text-gray-800 ' data-h1-placeholder='New Story Title' ></h1>
                        <p className='font-normal text-gray-700 ' data-p-placeholder="Write Your Story"></p>

                    </>
                )}
                {images.map(({ imageUrl, file }, index) => (
                    <ImageComponent key={index} imageUrl={imageUrl} file={file} handleSave={handleSave} />
                ))}
            </div>

            <div className={` z-10 absolute ${buttonPosition.top === 0 ? "hidden" : ""} `} style={{ top: buttonPosition.top, left: buttonPosition.left }}>
                <button id='tooltip' onClick={handleOpenTools} className='rounded-full border-[1px] border-neutral-500 p-1 inline-block'>
                    <Plus className={`duration-300 ease-linear   ${openTools ? "rotate-90" : ""} `} size={25} />
                </button>
                <div id='tool' className={`flex items-center space-x-4 absolute top-0 left-14 ${openTools ? "visible" : "invisible"}`}>

                    <CldUploadWidget uploadPreset="q2amm6ff" onUpload={handleFileUploadSuccess}>
                        {({ open }) => (
                            <span className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>

                                <Image onClick={() => open()} className='opacity-60 text-gray-800' size={20} />
                            </span>


                        )}
                    </CldUploadWidget>

                    <span onClick={addDivider} className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>
                        <MoreHorizontal className='opacity-60 text-gray-800 ' size={20} />
                    </span>
                    <span className={`border-[1.5px] border-blue-300 rounded-full block p-[6px] bg-white ${openTools ? "scale-100 visible" : "scale-0 invisible"} ease-linear duration-100`}>
                        <Code onClick={insertCodeBlock} className='opacity-60 text-gray-800 ' size={20} />
                    </span>
                </div>
            </div>
        </main>
    )
}

export default NewStory

const ImageComponent = ({ imageUrl, file, handleSave }: { imageUrl: string, file: File, handleSave: () => void }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl)
    useEffect(() => {
        setCurrentImageUrl(imageUrl)
        console.log("Image Component URL:", currentImageUrl)

        handleSave()
    }, [imageUrl]) // Ensure the effect runs when imageUrl changes
    return (
        <div className='py-3'>
            <div>
                <img src={currentImageUrl} alt="Image" className='max-w-full h-[450px]' />
                <div className='text-center text-sm max-w-md mx-auto'>
                    <p data-p-placeholder='Type caption for your image'></p>
                </div>
            </div>
            <p data-p-placeholder='...'></p>
        </div>
    )
}

const Divider = () => {
    return (
        <div className='py-3 w-full'>
            <div className=' text-center flex flex-col items-center justify-center' contentEditable={false}>
                <MoreHorizontal className='opacity-60 text-gray-800 ' size={32} />
            </div>
            <p data-p-placeholder='Continue Writing...'></p>
        </div>
    )
}

const CodeBlock = () => {
    const [language, setLanguage] = useState('javascript')
    const [code, setCode] = useState('')
    const [highlightedCode, setHighlightedCode] = useState('')

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value)
    }

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault()
        setCode(event.currentTarget.value || '')
    }

    const handlePaste = async () => {
        try {
            const clipboardData = await navigator.clipboard.readText()
            setCode((prev) => prev + clipboardData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const highlighted = hljs.highlight(code, {
            language,
            ignoreIllegals: true
        }).value
        setHighlightedCode(highlighted)
    }, [code, language, highlightedCode])

    return (
        <div className='w-full'>
            <div className='prose w-full relative bg-gray-50 rounded-sm p-5 focus:outline-none'>
                <select contentEditable={false} className='bg-gray-100 border-dotted border-[2px] rounded-sm p-1 text-stone-700' defaultValue={"Language"} onChange={handleLanguageChange} name="" id="">
                    <option value="javascript">Javascript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                </select>
                <textarea name="" contentEditable={false} className='focus:outline-none p-2 w-full' onChange={handleCodeChange} id=""></textarea>
                <button onClick={handlePaste} className='absolute top-2 right-2 cursor-pointer'>
                    <ClipboardPasteIcon />
                </button>
                <div className={`language-${language} text-base block overflow-auto p-3 focus:outline-none`}
                    dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                </div>
            </div>
            <p data-p-placeholder='...'></p>
        </div>
    )
}
