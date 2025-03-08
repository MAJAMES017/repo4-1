// pages/api/search.js
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

    const response = await drive.files.list({
      q: `'${folderId}' in parents and name contains '${query}'`,
      fields: "files(id, name, mimeType)",
    });

    res.status(200).json({ files: response.data.files });
  } catch (error) {
    console.error("Drive API error:", error);
    res.status(500).json({ error: error.message });
  }
}
