import { Option2, Response } from "@/app/types";
import ResponseForm from "./responseForm";
import { useEffect, useRef, useState } from "react";

interface QuestOptionFormProps {
  option: Option2;
  updateOption: (option: Option2, originalKey: string) => void;
  index?: number;
  total?: number;
}

export default function QuestOptionForm({
  option,
  updateOption,
  index,
  total,
}: QuestOptionFormProps) {
  const [key, setKey] = useState(option.key);
  const [body, setBody] = useState(option.body);
  const [responses, setResponses] = useState(option.responses || []);

  useEffect(() => {
    const updatedOption = {
      ...option,
      key,
      body,
      responses,
    };
    updateOption(updatedOption, option.key);
  }, [key, body, responses]);

  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleDeleteResponses() {
    if (!dialogRef.current) return;
    dialogRef.current.showModal();
  }

  function confirmDelete() {
    setResponses([]);
    if (!dialogRef.current) return;
    dialogRef.current.close();
  }

  function createMultiPageDialog() {
    console.log("Create multi page dialog");
    const currentOption = option;
    currentOption.pages = [
      {
        body: option.body,
        vibe: 0,
      },
    ];
    updateOption(currentOption, option.key);
  }

  return (
    <div className="option-container">
      {/* Option Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="option-header">
          <span>💬</span>
          <span className="font-mono">{key || "unnamed"}</span>
          {total && <span className="ml-2 text-xs font-normal text-emerald-100">[{index! + 1}/{total}]</span>}
        </div>
      </div>

      {/* Option Content - Form Section */}
      <div className="card-dark p-4 mb-3">
        <div className="form-group">
          <label className="form-label">Option Key (Identifier)</label>
          <input
            type="text"
            className="form-input font-mono text-xs"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g., greeting, farewell"
          />
        </div>

        <div className="form-group">
          <label className="form-label">NPC Dialogue Text</label>
          <textarea
            className="form-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What does the NPC say to the player?"
          />
        </div>
      </div>

      {/* Mode Selection - Single vs Multi-page */}
      <div className="flex-gap mb-3">
        {!option.pages ? (
          <>
            <button
              className="btn-secondary text-sm"
              onClick={() =>
                setResponses([
                  ...responses,
                  { next: `response-${responses.length + 1}`, body: "", vibe: 0 },
                ])
              }
              title="Add a player response choice"
            >
              + Response ({responses.length})
            </button>
            <button
              className="btn-warning text-sm"
              onClick={() => createMultiPageDialog()}
              title="Convert to multi-page dialogue (pages can't be mixed with simple responses)"
            >
              → Multi-Page Mode
            </button>
          </>
        ) : (
          <div className="text-amber-300 text-xs flex items-center gap-1">
            <span>📄</span>
            <span>Multi-page mode ({option.pages.length} pages)</span>
          </div>
        )}
      </div>

      {/* Clear/Reset */}
      {responses.length > 0 && (
        <div className="mb-3">
          <button
            className="btn-danger text-sm"
            onClick={() => handleDeleteResponses()}
            title="Remove all responses"
          >
            ✕ Clear All Responses
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-lg shadow-xl border border-slate-600 p-6 max-w-sm bg-slate-800"
      >
        <h2 className="text-lg font-bold text-slate-100 mb-4">Clear All Responses?</h2>
        <p className="text-slate-400 mb-6">
          This will delete all player response choices for this NPC dialogue.
        </p>
        <div className="flex-gap justify-end">
          <button
            className="btn-tertiary text-sm"
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.close();
              }
            }}
          >
            Cancel
          </button>
          <button className="btn-danger text-sm" onClick={() => confirmDelete()}>
            Confirm Delete
          </button>
        </div>
      </dialog>

      {/* Multi-Page Dialogue Section */}
      {option.pages && option.pages.length > 0 && (
        <div className="bg-slate-800 p-4 rounded-lg border border-violet-400/30 mb-3">
          <h3 className="font-bold text-violet-300 mb-4 flex items-center gap-2">
            <span>📄</span>
            <span>Multi-Page Dialogue ({option.pages.length} pages)</span>
          </h3>

          <div className="space-y-4">
            {option.pages.map((op, index) => {
              return (
                <div key={index} className="page-container">
                  <div className="flex-between mb-3">
                    <div className="page-header">
                      Page {index + 1}/{option.pages!.length}
                    </div>
                    <span className="text-xs text-violet-300">
                      {op.responses?.length || 0} response{op.responses?.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="card-dark p-3">
                    <div className="form-group">
                      <label className="form-label">Page Dialogue</label>
                      <textarea
                        className="form-textarea text-sm"
                        value={op.body}
                        onChange={(e) => {
                          const currentOption = option;
                          if (!currentOption.pages) return;
                          currentOption.pages[index].body = e.target.value;
                          updateOption(currentOption, option.key);
                        }}
                        placeholder="What does the NPC say on this page?"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Vibe Score</label>
                      <input
                        type="number"
                        className="form-input text-sm"
                        value={op.vibe}
                        onChange={(e) => {
                          const currentOption = option;
                          if (!currentOption.pages) return;
                          currentOption.pages[index].vibe = Number(e.target.value);
                          updateOption(currentOption, option.key);
                        }}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Page Responses */}
                  {op.responses && op.responses.length > 0 && (
                    <div className="mt-3 border-t border-violet-400/30 pt-3">
                      <h4 className="font-semibold text-sm text-amber-300 mb-3">
                        👤 Player Responses:
                      </h4>
                      <div className="space-y-2">
                        {op.responses.map((response, rIndex) => {
                          function updateResponses(response: Response) {
                            const currentOption = option;
                            if (!currentOption.pages) return;
                            const newResponses = [
                              ...currentOption.pages[index].responses!,
                            ];
                            newResponses[rIndex] = response;
                            currentOption.pages[index].responses = newResponses;
                            updateOption(currentOption, option.key);
                          }

                          return (
                            <ResponseForm
                              key={rIndex}
                              props={response}
                              updateState={updateResponses}
                              isCompact={true}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add response button for this page */}
                  {option.pages && index === option.pages.length - 1 && (
                    <button
                      className="btn-secondary text-xs mt-3 w-full"
                      onClick={() => {
                        const currentOption = option;
                        if (!currentOption.pages) return;
                        if (!currentOption.pages[index].responses) {
                          currentOption.pages[index].responses = [];
                        }
                        currentOption.pages[index].responses!.push({
                          next: `response-${currentOption.pages[index].responses!.length + 1}`,
                          body: "",
                          vibe: 0,
                        });
                        updateOption(currentOption, option.key);
                      }}
                    >
                      + Add Response to Page {index + 1}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add new page button */}
          <button
            className="btn-secondary text-sm w-full mt-4"
            onClick={() => {
              const currentOption = option;
              if (!currentOption.pages) return;
              currentOption.pages.push({
                body: "",
                vibe: 0,
              });
              updateOption(currentOption, option.key);
            }}
          >
            + Add Page
          </button>
        </div>
      )}

      {/* Single-Page Responses Section */}
      {responses && responses.length > 0 && (
        <div className="bg-slate-800 p-4 rounded-lg border border-amber-400/30">
          <h3 className="font-bold text-amber-300 mb-3 flex items-center gap-2">
            <span>👤</span>
            <span>Player Responses ({responses.length})</span>
          </h3>
          <div className="space-y-2">
            {responses.map((response, index) => {
              function updateResponses(response: Response) {
                const newResponses = [...responses];
                newResponses[index] = response;
                setResponses(newResponses);
              }

              return (
                <ResponseForm
                  key={index}
                  props={response}
                  updateState={updateResponses}
                  index={index}
                  isCompact={true}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
