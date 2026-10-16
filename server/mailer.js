// Sends you an email for every contact-form message when SMTP_* env vars are set.
const nodemailer = require("nodemailer");

let transporter = null;
const enabled = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function notify(m) {
  if (!enabled()) return;
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  await getTransporter().sendMail({
    from: `"Portfolio" <${process.env.SMTP_USER}>`,
    to,
    replyTo: `"${m.name.replace(/"/g, "")}" <${m.email}>`,
    subject: `[Portfolio] ${m.topic}: ${m.name}${m.company ? " (" + m.company + ")" : ""}`,
    text: `${m.message}\n\nFrom: ${m.name} <${m.email}>\nCompany: ${m.company || "-"}\nTopic: ${m.topic}\nAt: ${m.createdAt}`,
    html: `<p>${escapeHtml(m.message).replace(/\n/g, "<br>")}</p><hr><p><b>From:</b> ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;<br><b>Company:</b> ${escapeHtml(m.company || "-")}<br><b>Topic:</b> ${escapeHtml(m.topic)}<br><b>At:</b> ${m.createdAt}</p>`
  });
}

module.exports = { notify, enabled };
