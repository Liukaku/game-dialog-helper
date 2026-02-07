"use client";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Quest, Root } from "../../types";
import ResponseForm from "@/components/responseForm";
import QuestOptionForm from "@/components/questOptionForm";
import QuestForm from "@/components/questForm";

export default function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [state, setState] = useState<Root>();

  useEffect(() => {
    getInitialState().then(setState).catch(console.error);
  }, []);

  useEffect(() => {
    saveDialog();
  }, [state]);

  async function saveDialog() {
    if (!state) return;
    console.log(JSON.stringify(state));
    fetch(`/api/dialog/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    console.log("Save dialog response sent");
  }

  async function getInitialState() {
    const data = await fetch(`/api/dialog/${id}`);
    const json = await data.json();
    console.log("Loaded dialog:", json);
    return json[0].data as Root;
  }

  function updateStoryQuest(quest: Quest, index: number) {
    console.log("Updating quest:", quest);
    if (!state) return;
    const currentState = state;
    const updatedQuests = [...currentState.story.quests];
    updatedQuests[index] = quest;

    currentState.story.quests = updatedQuests;
    setState({ ...currentState });
  }

  function CreateNewQuest(type: "general" | "story") {
    if (!state) return;
    console.log("Create new quest");
    const currentState = state;
    switch (type) {
      case "general":
        currentState.general.optionsByTier.push({
          tier: 0,
          options: [],
        });
        setState({ ...currentState });
        break;
      case "story":
        currentState.story.quests.push({
          questUid: `quest-${currentState.story.quests.length + 1}`,
          questStepIndex: 0,
          options: [],
        });
        setState({ ...currentState });
        break;
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 card-dark p-6 border-l-4 border-sky-400">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-100 flex items-center gap-3">
              <span>📖</span>
              <span>Dialog Builder</span>
            </h1>
            <div className="text-sm text-slate-400">
              File: <span className="font-mono font-semibold text-sky-300">{id}.json</span>
            </div>
          </div>
          <p className="text-slate-400">
            Build quest dialogs with branching conversations and multi-page narratives
          </p>
        </div>

        {/* Loading State */}
        {!state && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
            <p className="mt-4 text-slate-400">Loading dialog...</p>
          </div>
        )}

        {state && (
          <>
            {/* Controls Panel */}
            <div className="card-dark p-6 mb-8 border-l-4 border-emerald-400">
              <h2 className="section-header">
                <span>⚙️</span>
                <span>Quick Actions</span>
              </h2>
              <div className="flex-gap">
                <button
                  onClick={() => CreateNewQuest("story")}
                  className="btn-secondary"
                >
                  + Create New Quest
                </button>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-muted-sm">
                  {state.story.quests.length} quest{state.story.quests.length !== 1 ? "s" : ""} • Auto-save enabled
                </p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-6">
              {/* Quests List */}
              <div>
                <h2 className="section-header">
                  <span>📚</span>
                  <span>Story Quests</span>
                </h2>

                {state.story.quests.length === 0 ? (
                  <div className="card-dark p-12 text-center border-2 border-dashed border-slate-700">
                    <p className="text-slate-400 mb-4">
                      No quests yet. Create one to begin building your dialog.
                    </p>
                    <button
                      onClick={() => CreateNewQuest("story")}
                      className="btn-secondary"
                    >
                      + Create First Quest
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.story.quests.map((quest, index) => {
                      const originalKey = quest.questUid;
                      function updateQuest(quest: Quest) {
                        updateStoryQuest(quest, index);
                      }
                      return (
                        <div key={originalKey}>
                          <QuestForm quest={quest} updateStoryQuest={updateQuest} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Status Footer */}
            <div className="mt-12 py-4 border-t border-slate-700 text-center text-sm text-slate-500">
              💾 Changes saved automatically
            </div>
          </>
        )}
      </div>
    </div>
  );
}
