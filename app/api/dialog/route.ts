import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

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

export interface DialogOption {
  filename: string;
}
