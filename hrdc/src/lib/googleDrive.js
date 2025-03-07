import { google } from "googleapis";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

const drive = google.drive({
  version: "v3",
  auth: apiKey, 
});

export default drive;
