"use client";
import Image from "next/image";
import * as blob from "../public/NPC_B.json"
import { useState } from "react";
import { Root } from "./types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";

export default function Home() {

  const [state, setState] = useState<Root>(blob)

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col w-5/6 m-auto ">
        <div className="text-center font-black text-2xl my-8">
          <h1>Dialog Builder</h1>
        </div>
        <h2>Story Quest</h2>
        {state.story.quests.map((quest) => {
          return(
          <QuestForm quest={quest} />
          )
        })}
      </div>
    </div>
  );
}
