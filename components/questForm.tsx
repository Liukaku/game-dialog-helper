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
    <div className="quest-container">
      {/* Quest Header with Collapse Button */}
      <div className="flex-between mb-4">
        <div className="quest-header">
          <span className="text-lg">📖</span>
          <span className="font-mono text-base">{questUid}</span>
          <span className="ml-2 text-xs font-normal text-slate-300">Step {questStepIndex}</span>
        </div>
        <button
          onClick={toggleHideDiv}
          className="text-slate-400 hover:text-slate-200 transition text-xl"
          title={sectionDisplay ? "Hide options" : "Show options"}
        >
          {sectionDisplay ? "▼" : "▶"}
        </button>
      </div>

      {/* Quest Metadata */}
      <div className="card-dark p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Quest UID</label>
            <input
              type="text"
              className="form-input"
              value={questUid}
              onChange={(e) => setQuestUid(e.target.value)}
              placeholder="e.g., quest-1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Step Index</label>
            <input
              type="number"
              className="form-input"
              value={questStepIndex}
              onChange={(e) => setQuestStepIndex(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Options Control */}
      <div className="flex-gap mb-4">
        <button
          className="btn-secondary"
          onClick={() => CreateNewOption()}
          title="Add a new NPC dialogue option"
        >
          + New Option ({quest.options.length})
        </button>
      </div>

      {/* Options List */}
      <div ref={divRef} className="space-y-3">
        {quest.options.length === 0 ? (
          <div className="text-slate-500 italic text-sm text-center py-6 bg-slate-700 rounded border border-slate-600">
            No options yet. Create one to add NPC dialogue.
          </div>
        ) : (
          quest.options.map((option, index) => {
            const originalKey = option.key;
            function updateOption(option: Option2) {
              UpdateOption(option, index);
            }
            return (
              <div key={originalKey}>
                <QuestOptionForm
                  option={option}
                  updateOption={updateOption}
                  index={index}
                  total={quest.options.length}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
