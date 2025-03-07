export default function handler(req, res) {
    res.json({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });
  }