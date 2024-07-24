"use client"
import { getStoryByTag } from '@/actions/getStories'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import StoryItem from '../components/StoryItem'

type Props = {}

const SearchList = (props: Props) => {
    const searchParams = useSearchParams()
    const searchValue = searchParams.get("for")
    const [filteredStories, setFilteredStories] = React.useState<any[]>()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getStoryByTag(searchValue || "All")
                setFilteredStories(response.stories)
            } catch (error) {
                console.log("Error fetching stories")
            }
        }
        fetchData()
    }, [searchValue])
    return (
        <div>
            <div className='flex flex-col gap-10 '>
                {filteredStories?.map((story: any) => (
                    <StoryItem key={story.id} story={story} />
                ))}
            </div>
        </div>
    )
}

export default SearchList