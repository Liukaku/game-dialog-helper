"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Root } from "../../types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";

export default function Home({params}: {
  params: Promise<{id: string}>
}) {
  const { id } = use(params)
  async function getInitialState() {
    const data = await fetch(`/api/dialog/${id}`)
    const json = await data.json()
    console.log("Loaded dialog:", json)
    return json[0].data as Root
  }

  const [state, setState] = useState<Root>()

  useEffect(() => {
    getInitialState().then(setState).catch(console.error)
  }, [])

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col w-5/6 m-auto ">
        <div className="text-center font-black text-2xl my-8">
          <h1>Dialog Builder</h1>
        </div>
        <h2>Story Quest</h2>
        {state?.story.quests.map((quest) => {
          return (
            <QuestForm quest={quest} />
          )
        })}
      </div>
    </div>
  );
}
