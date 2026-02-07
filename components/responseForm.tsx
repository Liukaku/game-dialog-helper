import { Response } from "@/app/types";
import { useEffect, useState } from "react";

interface ResponseFormProps {
  props: Response;
  updateState: (response: Response) => void;
  index?: number;
  isCompact?: boolean;
}

export default function ResponseForm({
  props,
  updateState,
  index,
  isCompact,
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
    <div className={isCompact ? "response-container" : "response-container mb-4"}>
      <div className="response-header">
        <span>👤</span>
        {index !== undefined && <span className="ml-1">Choice {index + 1}</span>}
      </div>

      <div className={isCompact ? "space-y-2" : "card-dark p-3"}>
        <div className="form-group">
          <label className="form-label">Player Choice Text</label>
          {!isCompact && (
            <p className="text-muted-sm mb-2">
              This appears as a button the player can click
            </p>
          )}
          <textarea
            className={isCompact ? "form-textarea text-xs" : "form-textarea"}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What does the player say or choose?"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Next Option (Key)</label>
          {!isCompact && (
            <p className="text-muted-sm mb-2">
              Which NPC option comes next? (e.g., &quot;greeting&quot;, &quot;farewell&quot;)
            </p>
          )}
          <input
            type="text"
            className={isCompact ? "form-input font-mono text-xs" : "form-input font-mono"}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            placeholder="e.g., option-1"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Vibe Score</label>
          {!isCompact && (
            <p className="text-muted-sm mb-2">
              Personality response (e.g., 0=neutral, 1=friendly, -1=hostile)
            </p>
          )}
          <input
            type="number"
            className={isCompact ? "form-input text-xs" : "form-input"}
            value={vibe}
            onChange={(e) => setVibe(Number(e.target.value))}
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
