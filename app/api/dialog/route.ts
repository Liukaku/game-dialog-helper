import { Root } from "@/app/types";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export interface DialogOption {
  filename: string;
}

export function GET() {
  const dialogDir = path.join(process.cwd(), `public/dialog`);

  const files = fs
    .readdirSync(dialogDir)
    .filter((file) => file.includes(".json"));

  const dialogs = files.map((file) => {
    return {
      filename: file,
    };
  });

  Response.json(dialogs);
  return new Response(JSON.stringify(dialogs), {
    headers: { "Content-Type": "application/json" },
  });
}

export function POST(request: Request) {
  return request.json().then((data) => {
    const { filename } = data;
    if (!filename) {
      return new Response(JSON.stringify({ error: "Filename is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const dialogDir = path.join(process.cwd(), `public/dialog`);
    const filePath = path.join(dialogDir, filename);

    if (fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "File already exists" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const intialData: Root = {
      general: {
        optionsByTier: [],
      },
      story: {
        quests: [],
      },
    };

    fs.writeFileSync(filePath, JSON.stringify(intialData, null, 2));

    // redirect to edit page for new dialog 303 status code
    return new Response(JSON.stringify({ filename }), {
      status: 303,
      headers: {
        "Content-Type": "application/json",
        Location: `/edit/${filename.replace(".json", "")}`,
      },
    });
  });
}
