// src/lib/knowledgeBase.js
// Single source of truth for everything the AI assistant knows about
// Muhire Dieudonne. Used both to render UI (nav targets, CV link) and to
// build the RAG context sent to the language model on the backend.

export const PROFILE = {
  name: "Muhire Dieudonne",
  title: "Software Developer",
  phone: "+250 798 728 379",
  email: "muhiredieu7@gmail.com",
  location: "Mahama, Kirehe District, Eastern Province, Rwanda",
  github: "https://github.com/MUHIRE-DIEUDONNE",
  linkedin: "https://www.linkedin.com/feed/",
  portfolio: "https://md-react-portifolio.onrender.com/",
  cvUrl: "/Muhire_Dieudonne_CV.pdf", // place the exported CV PDF in /public with this name
  summary:
    "A passionate and dedicated Software Developer with a Bachelor's Degree in Software Development from the University of Rwanda. Strong knowledge of full-stack web development, building responsive, secure, user-friendly applications, skilled in modern web technologies, database design, and software engineering principles. Committed to continuous learning and delivering innovative digital solutions.",
  careerObjective:
    "To obtain a Software Developer position where I can apply my technical knowledge, creativity, and problem-solving abilities to build high-quality software solutions while continuously improving my skills and contributing to the growth and success of the organization.",
}

export const EDUCATION = [
  {
    degree: "Bachelor's Degree in Software Development",
    school: "University of Rwanda",
    location: "Kirehe District, Eastern Province, Rwanda",
  },
]

export const TECH_SKILLS = [
  "HTML5", "CSS3", "JavaScript (ES6+)", "React.js", "PHP", "Laravel",
  "Node.js", "MySQL", "MongoDB", "Firebase", "RESTful APIs", "Git & GitHub",
  "Tailwind CSS", "Bootstrap", "Responsive Web Design", "Microsoft Office",
]

export const PERSONAL_SKILLS = [
  "Problem Solving", "Critical Thinking", "Teamwork & Collaboration",
  "Communication Skills", "Leadership", "Time Management",
  "Fast Learning Ability", "Adaptability", "Attention to Detail",
]

export const LANGUAGES = [
  { name: "Kinyarwanda", level: "Native" },
  { name: "English", level: "Professional Working Proficiency" },
]

export const PROJECTS = [
  {
    id: "cooperative",
    title: "Cooperative Management System",
    description:
      "A web-based cooperative management system with member registration, savings, loan management, repayments, reporting, and an administrator dashboard.",
    tags: ["React", "Node.js", "MySQL"],
  },
  {
    id: "school",
    title: "School Management System",
    description:
      "A complete school management platform for managing students, teachers, attendance, grading, and administration.",
    tags: ["PHP", "Laravel", "MySQL"],
  },
  {
    id: "ai-portfolio",
    title: "AI Portfolio Website",
    description:
      "A modern portfolio website featuring an AI-powered voice assistant, interactive UI, responsive design, and a project showcase — the very site this assistant lives on.",
    tags: ["React", "Voice AI", "Tailwind CSS"],
  },
]

// Section ids the portfolio page is expected to expose, e.g.
// <section id="projects"> ... </section>. Voice/text navigation commands
// resolve against this map.
export const SECTION_IDS = {
  about: "about",
  skills: "skills",
  projects: "projects",
  experience: "experience",
  education: "education",
  contact: "contact",
  testimonials: "testimonials",
  home: "home",
}

// Flattened, model-friendly context block. Kept as plain text rather than
// a vector index because the corpus is small enough to pass in full —
// this *is* the retrieval step for a KB this size.
export const KB_CONTEXT_TEXT = `
PROFILE
Name: ${PROFILE.name}
Title: ${PROFILE.title}
Location: ${PROFILE.location}
Summary: ${PROFILE.summary}
Career objective: ${PROFILE.careerObjective}

CONTACT
Email: ${PROFILE.email}
Phone: ${PROFILE.phone}
GitHub: ${PROFILE.github}
LinkedIn: ${PROFILE.linkedin}
Portfolio: ${PROFILE.portfolio}

EDUCATION
${EDUCATION.map(e => `- ${e.degree}, ${e.school}, ${e.location}`).join("\n")}

TECHNICAL SKILLS
${TECH_SKILLS.join(", ")}

PERSONAL SKILLS
${PERSONAL_SKILLS.join(", ")}

LANGUAGES
${LANGUAGES.map(l => `- ${l.name}: ${l.level}`).join("\n")}

PROJECTS
${PROJECTS.map(p => `- ${p.title} [${p.tags.join(", ")}]: ${p.description}`).join("\n")}
`.trim()

/** Trigger a CV download using an anchor click (no page navigation). */
export function downloadCV() {
  const a = document.createElement("a")
  a.href = PROFILE.cvUrl
  a.download = "Muhire_Dieudonne_CV.pdf"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/** Scroll to a named section of the host page, if present. */
export function scrollToSection(sectionKey) {
  const id = SECTION_IDS[sectionKey]
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior: "smooth", block: "start" })
  return true
}
