"use client";

import { useState, useEffect } from "react";
import { DialogOption } from "@/app/api/dialog/route";

export default function HomeClient() {
  const [state, setState] = useState<DialogOption[] | null>(null);

  async function getInitialState() {
    const data = await fetch(`/api/dialog`);
    const json: DialogOption[] = await data.json();
    console.log("Loaded dialog:", json);
    return json;
  }

  useEffect(() => {
    getInitialState().then(setState).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="card-dark p-8 mb-8 border-l-4 border-sky-400">
          <h1 className="text-4xl font-bold text-slate-100 mb-2 flex items-center gap-3">
            <span>📖</span>
            <span>Dialog Builder</span>
          </h1>
          <p className="text-slate-400">
            Manage your quest dialogs and conversations
          </p>
        </div>

        {/* Loading State */}
        {!state && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            <p className="mt-4 text-slate-400">Loading dialogs...</p>
          </div>
        )}

        {/* Dialog List */}
        {state && (
          <div className="space-y-4">
            <h2 className="section-header">
              <span>📚</span>
              <span>Available Dialogs ({state.length})</span>
            </h2>

            {state.length === 0 ? (
              <div className="card-dark p-8 text-center border-2 border-dashed border-slate-700">
                <p className="text-slate-400 mb-4">
                  No dialogs created yet. Create one to get started.
                </p>
                <a href="/edit/new">
                  <button className="btn-secondary">
                    + Create First Dialog
                  </button>
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.map((dialog) => {
                  const dialogName = dialog.filename.replace(".json", "");
                  return (
                    <a
                      key={dialog.filename}
                      href={`/edit/${dialogName}`}
                      className="card-dark p-6 border-l-4 border-sky-400 hover:border-sky-300 hover:bg-slate-800 transition block group"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-sky-300 transition font-mono">
                            {dialogName}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            Click to edit
                          </p>
                        </div>
                        <span className="text-2xl">→</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Create New Button */}
            <div className="mt-8">
              <a href="/edit/new">
                <button className="btn-secondary w-full py-3">
                  + Create New Dialog
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
