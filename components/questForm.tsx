import { Quest } from "@/app/types";
import QuestOptionForm from "./questOptionForm";
import { useRef, useState } from "react";

interface QuestFormProps {
    quest: Quest;
}

export default function QuestForm({ quest }: QuestFormProps) {
    const [questUid, setQuestUid] = useState(quest.questUid);
    const [questStepIndex, setQuestStepIndex] = useState(quest.questStepIndex);
    const [sectionDisplay, setSectionDisplay] = useState(false);

    const divRef = useRef<HTMLDivElement>(null);

    const toggleHideDiv = () => {
        if (divRef.current) {
            divRef.current.classList.toggle("hidden");
            setSectionDisplay(!sectionDisplay);
        }
    };
    
    return (
        <div className="border border-gray-300 p-4 mb-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-2z w-5/6 m-auto p-4 bg-white rounded-lg shadow-md border border-gray-300">
            <label className="text-sm font-semibold">
                Quest UID:
            </label>
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
                    onClick={toggleHideDiv}
                    className="text-blue-500 hover:underline mb-2"
                >
                    {sectionDisplay ? "Show Options" : "Hide Options"}
                </button>
            <div ref={divRef} className="mt-2">
                {quest.options.map((option, index) => (
                        <QuestOptionForm option={option} />

                ))}
            </div>
        </div>
    );
}