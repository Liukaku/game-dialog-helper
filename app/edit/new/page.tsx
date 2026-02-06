"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Root } from "../../types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";
import { DialogOption } from "@/app/api/dialog/route";

export default function Home({params}: {
  params: Promise<{id: string}>
}) {
  async function getInitialState() {
    const data = await fetch(`/api/dialog`)
    const json: DialogOption[] = await data.json()
    console.log("Loaded dialog:", json)
    return json
  }

  const [state, setState] = useState<DialogOption[] | null>(null)

  useEffect(() => {
    getInitialState().then(setState).catch(console.error)
  }, [])

  return (
    <div className="bg-gray-100 text-center">
      <div className="flex flex-col w-5/6 m-auto ">
        <div className="text-center font-black text-2xl my-8">
          <h1>Dialog Builder</h1>
        </div>
        <h2 className="text-xl">Create a new Story Quest Dialog</h2>

        <h3 className="mt-4">Existing Dialogs</h3>
        {/* read only list of dialog names, not links */}
        {state?.map((dialog) => (
        <div key={dialog.filename} className="bg-gray-200 p-2 rounded my-1">
            {dialog.filename.replace(".json", "")}
        </div>
        ))}
    
      </div>
    </div>
  );
}
