"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Root } from "../../types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";
import { DialogOption } from "@/app/api/dialog/route";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  async function getInitialState() {
    const data = await fetch(`/api/dialog`);
    const json: DialogOption[] = await data.json();
    console.log("Loaded dialog:", json);
    return json;
  }

  const [state, setState] = useState<DialogOption[] | null>(null);
  const [nameError, setError] = useState<string | null>(null);
  const [dialogName, setDialogName] = useState("");

  useEffect(() => {
    getInitialState().then(setState).catch(console.error);
  }, []);

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

        <form
          className="bg-white p-4 rounded-lg shadow-md mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            if (!dialogName) {
              alert("Please enter a dialog name");
              return;
            }
            // this returns a 303 redirect to the new dialog page, so we need to follow the redirect manually
            fetch("/api/dialog", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ filename: dialogName + ".json" }),
            }).then((response) => {
              console.log("Create dialog response:", response);
              if (response.redirected === true || response.status === 303) {
                const location = response.url;
                if (location) {
                  window.location.href = location;
                } else {
                  alert("Failed to create dialog: No location header");
                }
              } else {
                response.json().then((data) => {
                  alert("Failed to create dialog: " + data.error);
                });
              }
            });
          }}
        >
          <h2 className="text-lg font-bold mb-2">Create New Dialog</h2>
          <label className="text-sm font-semibold">Dialog Name:</label>
          <br />
          <input
            type="text"
            className="border rounded p-2 font-mono w-full"
            placeholder="Enter dialog name (without .json)"
            onChange={(e) => {
              const value = e.target.value;
              if (!/^[a-zA-Z0-9_-]*$/.test(value)) {
                setError(
                  "Only letters, numbers, underscores, and dashes are allowed",
                );
              } else if (
                state?.some((dialog) => dialog.filename === value + ".json")
              ) {
                setError("A dialog with this name already exists");
              } else {
                setError(null);
                setDialogName(value);
              }
            }}
          />
          {nameError && (
            <p className="text-red-500 text-sm mt-1">{nameError}</p>
          )}
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={nameError !== null}
          >
            Create Dialog
          </button>
        </form>
      </div>
    </div>
  );
}
