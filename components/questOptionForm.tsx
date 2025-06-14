import { Option2 } from "@/app/types";
import ResponseForm from "./responseForm";
import { useState } from "react";

interface QuestOptionFormProps {
    option: Option2;
}

export default function QuestOptionForm({ option }: QuestOptionFormProps) {
    const [key, setKey] = useState(option.key);
    const [body, setBody] = useState(option.body);
    return (
        <div className="border border-gray-300 p-4 mb-4 bg-white rounded-lg shadow-md">
        <div className="flex flex-col gap-2z w-5/6 m-auto p-4 bg-white rounded-lg shadow-md border border-gray-300">
            <h2 className="text-lg font-bold mb-2">NPC</h2>
            <label className="text-sm font-semibold">
                Option Key:
            </label>
            <br />
            <input
                type="text"
                className="border rounded p-2 font-mono"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                />

            <label className="text-sm font-semibold">
                Option Body:
            <br />
            </label>
            <textarea
                className="border rounded p-2"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                />
        </div>
            {option.responses && option.responses.map((response, index) => (
                <ResponseForm props={response}/>
            ))}
        </div>
    );
}