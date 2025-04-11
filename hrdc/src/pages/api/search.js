export default async function handler(req, res) {
  const { query } = req.query;
  const folderId = "1Gnb8MTiUc9r9L1NfEMOCbzb5NG6YlhXu";

  const hasQuery = query && query.trim().length > 0;

  const searchString = hasQuery
    ? `'${folderId}' in parents and name contains '${query}'`
    : `'${folderId}' in parents`;

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        searchString
      )}&key=${process.env.GOOGLE_API_KEY}`
    );

    const data = await response.json();
    res.status(200).json({ files: data.files || [] });
  } catch (error) {
    console.error("Drive API error:", error);
    res.status(500).json({ error: error.message });
  }
}
