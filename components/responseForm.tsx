import { Response } from "@/app/types";
import { useEffect, useRef, useState } from "react";

interface ResponseFormProps {
  props: Response;
  updateState: (response: Response) => void;
}

export default function ResponseForm({
  props,
  updateState,
}: ResponseFormProps) {
  const [body, setBody] = useState(props.body);
  const [next, setNext] = useState(props.next);
  const [vibe, setVibe] = useState(props.vibe);

  useEffect(() => {
    if (props.body !== body || props.next !== next || props.vibe !== vibe) {
      const updatedResponse = {
        body,
        next,
        vibe,
      };
      updateState(updatedResponse);
    }
  }, [body, next, vibe]);

  return (
    <form className="flex flex-col gap-2z w-4/6 m-auto p-4 bg-white rounded-lg shadow-md border border-gray-300">
      <h2 className="text-lg font-bold mb-2">Player Form</h2>
      <p className="text-sm text-gray-500 mb-2">
        This will be displayed as a button, not a full response.
      </p>
      <label className="text-sm font-semibold">Response Body:</label>
      <textarea
        className="border rounded p-2"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <label className="text-sm font-semibold">Next Step (option key):</label>
      <input
        type="text"
        className="border rounded p-2"
        value={next}
        onChange={(e) => setNext(e.target.value)}
      />
      <label className="text-sm font-semibold">Vibe Score:</label>
      <input
        type="number"
        className="border rounded p-2"
        value={vibe}
        onChange={(e) => setVibe(Number(e.target.value))}
      />
    </form>
  );
}
