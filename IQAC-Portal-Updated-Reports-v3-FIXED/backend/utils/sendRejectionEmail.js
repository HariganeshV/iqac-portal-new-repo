const nodemailer = require("nodemailer");

const sendRejectionEmail = async (submission, reviewer, remarks) => {
  if (!process.env.SMTP_HOST || !submission.submittedByEmail) return;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: submission.submittedByEmail,
    subject: `IQAC report rejected by ${reviewer}`,
    text: `Your ${submission.role} report for ${submission.quarter} was rejected by ${reviewer}.\n\nReason: ${remarks}`
  });
};

module.exports = sendRejectionEmail;