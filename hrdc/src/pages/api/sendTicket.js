import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract request data
  const { issue, email, message, requestType, dates, reason } = req.body;

  let emailSubject = "";
  let emailBody = "";

  // Handle Support Ticket (Support.js)
  if (issue && email && message) {
    emailSubject = `New Support Ticket: ${issue}`;
    emailBody = `<p><strong>Issue:</strong> ${issue}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Message:</strong> ${message}</p>`;
  }
  // Handle Schedule Request (Schedule.js)
  else if (requestType && dates && reason) {
    emailSubject = `New Schedule Request: ${requestType}`;
    emailBody = `<p><strong>Request Type:</strong> ${requestType}</p>
                 <p><strong>Dates:</strong> ${dates}</p>
                 <p><strong>Reason:</strong> ${reason}</p>`;
  }
  // Reject invalid requests
  else {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Set up nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  try {
    // Send email
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: "hrdcticketing@gmail.com", 
      subject: emailSubject,
      text: emailBody.replace(/<[^>]*>?/gm, ""), // Plain text version (removes HTML tags)
      html: emailBody,
    });

    return res.status(200).json({ message: "Ticket sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send ticket" });
  }
}
