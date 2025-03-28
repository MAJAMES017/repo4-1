import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { issue, email, message } = req.body;

  if (!issue || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or use SMTP settings if not using Gmail
    auth: {
      user: process.env.EMAIL_USER, // Set this in your .env file
      pass: process.env.EMAIL_PASS, // Set this in your .env file
    },
  });

  try {
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: "hrdcticketing@gmail.com", // Replace with the recipient email
      subject: `New Support Ticket: ${issue}`,
      text: `Issue: ${issue}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Issue:</strong> ${issue}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    return res.status(200).json({ message: "Ticket sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send ticket" });
  }
}
