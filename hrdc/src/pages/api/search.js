// pages/api/search.js

export default function handler(req, res) {
  res.status(200).json({ message: "This API route is currently disabled." });
}


/*
import { google } from "googleapis";

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

  const folderId = "1Gnb8MTiUc9r9L1NfEMOCbzb5NG6YlhXu";

  try {
    const drive = google.drive({
      version: "v3",
      auth: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    });

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains '${query}'&key=${process.env.GOOGLE_API_KEY}`
    );

    res.status(200).json({ files: response.data.files });
  } catch (error) {
    console.error("Drive API error:", error);
    res.status(500).json({ error: error.message });
  }
}
*/