import { Option2, Quest } from "@/app/types";
import QuestOptionForm from "./questOptionForm";
import { useEffect, useRef, useState } from "react";

interface QuestFormProps {
  quest: Quest;
  updateStoryQuest: (quest: Quest) => void;
}

export default function QuestForm({ quest, updateStoryQuest }: QuestFormProps) {
  const [questUid, setQuestUid] = useState(quest.questUid);
  const [questStepIndex, setQuestStepIndex] = useState(quest.questStepIndex);
  const [thisQuest, setThisQuest] = useState(quest);
  const [sectionDisplay, setSectionDisplay] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setThisQuest({
      ...thisQuest,
      questUid,
      questStepIndex,
    });
  }, [questUid, questStepIndex]);

  useEffect(() => {
    updateStoryQuest(thisQuest);
  }, [thisQuest]);

  const toggleHideDiv = () => {
    if (divRef.current) {
      divRef.current.classList.toggle("hidden");
      setSectionDisplay(!sectionDisplay);
    }
  };

  function CreateNewOption() {
    console.log("Create new option");
    const currentQuest = thisQuest;
    const defaultKey =
      currentQuest.options.length == 0
        ? "greeting"
        : `option-${currentQuest.options.length + 1}`;
    currentQuest.options.push({
      key: defaultKey,
      body: "",
      responses: [],
    });
    setThisQuest({ ...currentQuest });
  }

  function UpdateOption(option: Option2, index: number) {
    console.log("Updating option:", option);
    const currentQuest = thisQuest;
    const updatedOptions = [...currentQuest.options];
    updatedOptions[index] = option;

    currentQuest.options = updatedOptions;
    setThisQuest({ ...currentQuest });
  }

  return (
    <div className="border border-gray-300 p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-2z w-5/6 m-auto p-4 bg-white rounded-lg shadow-md border border-gray-300">
        <label className="text-sm font-semibold">Quest UID:</label>
        <br />
        <input
          type="text"
          className="border rounded p-2 font-mono"
          value={questUid}
          onChange={(e) => setQuestUid(e.target.value)}
        />

        <label className="text-sm font-semibold">
          Quest Step Index:
          <br />
        </label>
        <input
          type="number"
          className="border rounded p-2"
          value={questStepIndex}
          onChange={(e) => setQuestStepIndex(Number(e.target.value))}
        />
      </div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => CreateNewOption()}
      >
        Create New Option
      </button>
      <button
        onClick={toggleHideDiv}
        className="bg-blue-500 text-white hover:underline px-4 py-2 rounded mb-4 "
      >
        {sectionDisplay ? "Show Options" : "Hide Options"}
      </button>
      <div ref={divRef} className="mt-2">
        {quest.options.map((option, index) => {
          const originalKey = option.key;
          function updateOption(option: Option2) {
            UpdateOption(option, index);
          }
          return (
            <QuestOptionForm
              key={originalKey}
              option={option}
              updateOption={updateOption}
            />
          );
        })}
      </div>
    </div>
  );
}
