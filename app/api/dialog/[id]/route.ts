import { Root } from "@/app/types";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export function GET(id: NextApiRequest) {
  const idValue = id.url?.split("/").slice(-1)[0];

  const dialogDir = path.join(process.cwd(), `public/dialog/`);

  const files = fs
    .readdirSync(dialogDir)
    .filter((file) => file === `${idValue}.json`);

  const dialogs = files.map((file) => {
    const filePath = path.join(dialogDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    return {
      filename: file,
      data: JSON.parse(content),
    };
  });

  Response.json(dialogs);
  return new Response(JSON.stringify(dialogs), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const idValue = request.url?.split("/").slice(-1)[0];
  const body: Root = await request.json();
  console.log("Saving dialog:", idValue, body);

  const dialogDir = path.join(process.cwd(), `public/dialog/`);

  const filePath = path.join(dialogDir, `${idValue}.json`);
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2), "utf-8");

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
