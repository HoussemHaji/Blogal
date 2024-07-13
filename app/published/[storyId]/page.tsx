import Navbar from "@/app/components/Navbar";
import { getPublishedStoryById } from "@/actions/getStories";
import { getUser } from "@/actions/User";
import RenderStory from "../RenderStory";
import { ST } from "next/dist/shared/lib/utils";

const page = async ({ params }: { params: { storyId: string } }) => {

    const Story = await getPublishedStoryById(params.storyId);
    if (!Story.response) return (
        <div>
            <h1>Story not found</h1>
        </div>

    )
    const User = await getUser(Story.response?.authorId as string);

    return (
        <div >
            <Navbar />
            <RenderStory AuthorFirstName={User?.firstName} AuthorLastName={User?.lastName} AuthorImage={User?.imageUrl} PublishedStory={Story.response} />
        </div>
    )
}

export default page