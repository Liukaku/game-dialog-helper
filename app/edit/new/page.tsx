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
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="card-dark p-8 mb-8 border-l-4 border-sky-400">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <span>✨</span>
            <span>Create New Dialog</span>
          </h1>
          <p className="text-slate-400">
            Start building a new quest dialog from scratch
          </p>
        </div>

        {/* Existing Dialogs Section */}
        <div className="card-dark p-6 mb-8 border-l-4 border-emerald-400">
          <h2 className="section-header">
            <span>📚</span>
            <span>Existing Dialogs</span>
          </h2>

          {!state ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
              <p className="mt-2 text-slate-400 text-sm">Loading dialogs...</p>
            </div>
          ) : state.length === 0 ? (
            <p className="text-slate-400 italic text-center py-4">No dialogs created yet</p>
          ) : (
            <div className="grid gap-2">
              {state.map((dialog) => (
                <div
                  key={dialog.filename}
                  className="bg-slate-700 p-3 rounded border border-slate-600 text-slate-300 text-sm font-mono"
                >
                  {dialog.filename.replace(".json", "")}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Form */}
        <form
          className="card-dark p-8 border-l-4 border-sky-400"
          onSubmit={(e) => {
            e.preventDefault();
            if (!dialogName) {
              alert("Please enter a dialog name");
              return;
            }
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
          <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <span>📝</span>
            <span>Dialog Details</span>
          </h2>

          <div className="form-group">
            <label className="form-label">Dialog Name</label>
            <p className="text-muted-sm mb-2">
              Use letters, numbers, underscores, and dashes only
            </p>
            <input
              type="text"
              className="form-input font-mono"
              placeholder="e.g., TOWN_GUARD, FOREST_QUEST_1"
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
              <p className="text-red-400 text-sm mt-2">{nameError}</p>
            )}
          </div>

          <div className="flex-gap mt-6">
            <button
              type="submit"
              className="btn-secondary flex-1"
              disabled={nameError !== null || !dialogName}
            >
              ✓ Create Dialog
            </button>
            <a href="/" className="flex-1">
              <button
                type="button"
                className="btn-tertiary w-full"
              >
                ← Back
              </button>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
