import Image from "next/image";
import Navbar from './components/Navbar';
import StoryList from "./components/StoryList";
import { AllStoryTopics } from "@/actions/getStories";
import { GetSelectedTopics } from "@/actions/topics";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

export default async function Home() {
  const allTopics = await AllStoryTopics()
  const UserTags = await GetSelectedTopics()
  if (UserTags.error === "No user found") {
    return (
      <main >
        <Navbar />

        <div className="max-w-[1100px] mx-auto px-5 mt-12 ">
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-4xl font-bold text-center">Welcome to Blogal</h1>
            <p className="text-center mt-5">Please sign in to view the stories</p>

          </div>
        </div>




      </main>
    );
  }



  return (
    <main >

      <Navbar />
      <div className="max-w-[1100px] mx-auto px-5 mt-12 ">
        <StoryList allTopics={allTopics.response} UserTags={UserTags.Tags} />
      </div>





    </main>
  );
}
