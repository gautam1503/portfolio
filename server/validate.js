const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOPICS = [
  "Full-time role (SDE)",
  "Full-time role (Java / Backend)",
  "Full-time role (Python / AI)",
  "Full-time role (Full-Stack)",
  "Freelance project",
  "Something else"
];

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function validateContact(body = {}) {
  if (clean(body.website, 200)) return { spam: true };

  const value = {
    name: clean(body.name, 100),
    email: clean(body.email, 150).toLowerCase(),
    company: clean(body.company, 120),
    topic: TOPICS.includes(body.topic) ? body.topic : "Something else",
    message: clean(body.message, 3000)
  };

  if (value.name.length < 2) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(value.email)) return { error: "Please enter a valid email address." };
  if (value.message.length < 10) return { error: "Your message is a bit short. Please add a few more details." };

  return { value };
}

module.exports = { validateContact };
