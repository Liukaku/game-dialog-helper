import { Option2, Response } from "@/app/types";
import ResponseForm from "./responseForm";
import { useEffect, useRef, useState } from "react";

interface QuestOptionFormProps {
  option: Option2;
  updateOption: (option: Option2, originalKey: string) => void;
}

export default function QuestOptionForm({
  option,
  updateOption,
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
    <div className="border border-gray-300 p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col gap-2z w-5/6 m-auto p-4 bg-white rounded-lg shadow-md border border-gray-300">
        <h2 className="text-lg font-bold mb-2">NPC</h2>
        <label className="text-sm font-semibold">Option Key:</label>
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
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() =>
          setResponses([
            ...responses,
            { next: `response-${responses.length + 1}`, body: "", vibe: 0 },
          ])
        }
        disabled={option.pages !== undefined}
      >
        Add Response
      </button>
      <button
        className={`${(option.responses ?? []).length > 0 ? "bg-gray-400" : "bg-orange-500"} text-white px-4 py-2 rounded mb-4`}
        disabled={(option.responses ?? []).length > 0}
        onClick={() => createMultiPageDialog()}
      >
        Create multi page dialog
      </button>
      <button
        className={`${responses.length === 0 ? "bg-gray-400" : "bg-red-500"} text-white px-4 py-2 rounded mb-4 float-right`}
        onClick={() => handleDeleteResponses()}
        disabled={responses.length === 0}
      >
        Clear Responses
      </button>

      <dialog
        ref={dialogRef}
        className="border border-gray-300 p-4 bg-white rounded-lg shadow-md m-auto"
      >
        <span className="block sm:inline w-full text-center text-lg font-bold mb-4">
          Are you sure you want to clear all responses?
        </span>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => confirmDelete()}
          >
            Confirm
          </button>
          <button
            className="bg-gray-400 text-white px-4 py-2 rounded mt-2"
            onClick={() => {
              if (dialogRef.current) {
                dialogRef.current.close();
              }
            }}
          >
            Cancel
          </button>
        </div>
      </dialog>

      {/* multi page dialog handler */}
      {option.pages &&
        option.pages.map((op, index) => {
          return (
            <div
              key={index}
              className="border border-gray-300 p-4 mb-4 bg-gray-50 rounded-lg shadow-md"
            >
              <h3 className="text-md font-bold mb-2">Page {index + 1}</h3>
              <label className="text-sm font-semibold">Page Body:</label>
              <br />
              <textarea
                className="border rounded p-2 w-full"
                value={op.body}
                onChange={(e) => {
                  const currentOption = option;
                  if (!currentOption.pages) return;
                  currentOption.pages[index].body = e.target.value;
                  updateOption(currentOption, option.key);
                }}
              />
              <label className="text-sm font-semibold mt-2">Vibe Score:</label>
              <input
                type="number"
                className="border rounded p-2 w-full"
                value={op.vibe}
                onChange={(e) => {
                  const currentOption = option;
                  if (!currentOption.pages) return;
                  currentOption.pages[index].vibe = Number(e.target.value);
                  updateOption(currentOption, option.key);
                }}
              />

              {op.responses &&
                op.responses.length > 0 &&
                op.responses.map((response, rIndex) => {
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
                    />
                  );
                })}

              {/* add reply button */}
              {index === option.pages!!.length - 1 && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mt-2"
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
                  Add Response to Page
                </button>
              )}
              {/* page responses */}
            </div>
          );
        })}

      {option.pages !== undefined && option.pages.length > 0 && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
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
          Add Page
        </button>
      )}

      {/* dialog response handler */}
      {responses &&
        responses.map((response, index) => {
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
            />
          );
        })}
    </div>
  );
}
