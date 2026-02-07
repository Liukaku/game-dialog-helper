"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Quest, Root } from "../../types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [state, setState] = useState<Root>();

  useEffect(() => {
    getInitialState().then(setState).catch(console.error);
  }, []);

  useEffect(() => {
    saveDialog();
  }, [state]);

  async function saveDialog() {
    if (!state) return;
    console.log(JSON.stringify(state));
    fetch(`/api/dialog/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    console.log("Save dialog response sent");
  }

  async function getInitialState() {
    const data = await fetch(`/api/dialog/${id}`);
    const json = await data.json();
    console.log("Loaded dialog:", json);
    return json[0].data as Root;
  }

  function updateStoryQuest(quest: Quest, index: number) {
    console.log("Updating quest:", quest);
    if (!state) return;
    const currentState = state;
    const updatedQuests = [...currentState.story.quests];
    updatedQuests[index] = quest;

    currentState.story.quests = updatedQuests;
    setState({ ...currentState });
  }

  function CreateNewQuest(type: "general" | "story") {
    if (!state) return;
    console.log("Create new quest");
    const currentState = state;
    switch (type) {
      case "general":
        currentState.general.optionsByTier.push({
          tier: 0,
          options: [],
        });
        setState({ ...currentState });
        break;
      case "story":
        currentState.story.quests.push({
          questUid: `quest-${currentState.story.quests.length + 1}`,
          questStepIndex: 0,
          options: [],
        });
        setState({ ...currentState });
        break;
    }
  }

  return (
    <div className="bg-gray-100">
      <div className="flex flex-col w-5/6 m-auto ">
        <div className="text-center font-black text-2xl my-8">
          <h1>Dialog Builder</h1>
        </div>
        <h2>Story Quest</h2>
        <button
          onClick={() => CreateNewQuest("story")}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
        >
          Create New Quest
        </button>
        {state?.story.quests.map((quest, index) => {
          const originalKey = quest.questUid;
          function updateQuest(quest: Quest) {
            updateStoryQuest(quest, index);
          }
          return (
            <>
              <QuestForm quest={quest} updateStoryQuest={updateQuest} />
            </>
          );
        })}
      </div>
    </div>
  );
}
