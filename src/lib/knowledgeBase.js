// src/lib/knowledgeBase.js
// Single source of truth for everything the AI assistant knows about
// Muhire Dieudonne. Used both to render UI (nav targets, CV link) and to
// build the RAG context sent to the language model on the backend.

export const PROFILE = {
  name: "Muhire Dieudonne",
  title: "Full Stack Developer",
  phone: "+250 798 728 379",
  email: "muhiredieu7@gmail.com",
  location: "Kigali, Rwanda",
  github: "https://github.com/MUHIRE-DIEUDONNE",
  linkedin: "https://www.linkedin.com/in/muhire-dieudonne-498845419/",
  instagram: "https://www.instagram.com/muhiredieu7/",
  twitter: "https://twitter.com/muhiredieu",
  portfolio: "https://md-react-portifolio.onrender.com/",
  cvUrl: "/MUHIRE_DIEUDONNE_CV.pdf",
  summary:
    "A Full Stack Developer from Kigali, Rwanda, with a Bachelor in Technology of Information Technology from RP Tumba College.",
  careerObjective:
    "To build and maintain useful, responsive, and reliable software solutions while continuing to improve as a full-stack developer.",
}

export const EDUCATION = [
  {
    degree: "Bachelor in Technology of Information Technology",
    school: "RP Tumba College",
    location: "Kigali, Rwanda",
  },
]

export const TECH_SKILLS = [
  "HTML5", "CSS3", "JavaScript", "React", "Tailwind CSS", "Node.js",
  "Express.js", "PHP", "REST APIs", "MySQL", "Python", "Git & GitHub",
  "SQL", "VS Code", "Postman", "npm",
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
    id: "snake-game",
    title: "Snake Game",
    description:
      "A browser game with keyboard controls, score tracking, and progressive difficulty.",
    tags: ["JavaScript", "HTML5", "CSS3", "Canvas API"],
    route: "/projects/snake-game",
    github: "https://github.com/muhire-dieudonne/snake_game",
    live: "https://muhire-dieudonne.github.io/snake_game/",
  },
  {
    id: "jump-game-in-vue",
    title: "Jump Game in Vue",
    description:
      "An endless runner with obstacle handling, score logic, and animation.",
    tags: ["Vue.js", "JavaScript", "CSS3", "HTML5"],
    route: "/projects/jump-game-in-vue",
    github: "https://github.com/muhire-dieudonne/jump_game_in_vue",
    live: "https://muhire-dieudonne.github.io/jump_game_in_vue/",
  },
  {
    id: "language-translator",
    title: "Language Translator",
    description:
      "A browser-based translation interface that sends text to a language API.",
    tags: ["JavaScript", "API Integration", "HTML5", "CSS3"],
    route: "/projects/language-translator",
    github: "https://github.com/muhire-dieudonne/language_translator",
    live: "https://muhire-dieudonne.github.io/language_translator/",
  },
  {
    id: "money-converter",
    title: "Money Converter",
    description:
      "A currency conversion interface using exchange-rate API data.",
    tags: ["JavaScript", "API Integration", "Chart.js", "Responsive Design"],
    route: "/projects/money-converter",
    github: "https://github.com/muhire-dieudonne/money_converter",
    live: "https://muhire-dieudonne.github.io/money_converter/",
  },
  {
    id: "3d-interactive-portfolio",
    title: "3-D Interactive Portfolio",
    description:
      "A React portfolio featuring 3-D visuals, motion, and responsive navigation.",
    tags: ["React", "Three.js", "Framer Motion", "WebGL"],
    route: "/projects/3d-interactive-portfolio",
    github: "https://github.com/muhire-dieudonne/3d-portfolio",
    live: "https://muhire-dieudonne.github.io/portfolio/",
  },
]

export const PORTFOLIO_PAGES = [
  { title: "Home", route: "/", summary: "Introduction to Muhire and links to his work, skills, services, About, and Contact pages." },
  { title: "About", route: "/about", summary: "Biography, education, professional interests, and the downloadable CV." },
  { title: "Skills", route: "/skills", summary: `Technical skill descriptions covering ${TECH_SKILLS.join(", ")}.` },
  { title: "Projects", route: "/projects", summary: "Project cards with descriptions, technologies, source repositories, and live demos when available." },
  { title: "Experience", route: "/experience", summary: "Academic projects, independent web projects, and ongoing professional development; no formal employers are claimed." },
  { title: "Education", route: "/education", summary: "Bachelor in Technology of Information Technology from RP Tumba College in Kigali, Rwanda." },
  { title: "Services", route: "/services", summary: "Frontend and full-stack development, React applications, backend APIs, database solutions, responsive websites, maintenance, and consultation." },
  { title: "Testimonials", route: "/testimonials", summary: "Explains collaboration principles; no verified client testimonials are currently listed." },
  { title: "Certificates", route: "/certificates", summary: "Reserved for verified certificates; none are currently listed." },
  { title: "Blog", route: "/blog", summary: "Sample articles about React, databases, full-stack planning, JavaScript, responsive design, APIs, PHP, and SQL." },
  { title: "Contact", route: "/contact", summary: `Contact form and contact details: ${PROFILE.email}, ${PROFILE.phone}.` },
  { title: "Privacy Policy", route: "/privacy", summary: "Information about contact data, local preferences, and external links." },
  { title: "Terms of Use", route: "/terms", summary: "Terms covering the portfolio’s informational content and project descriptions." },
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
  services: "services",
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
Instagram: ${PROFILE.instagram}
Twitter: ${PROFILE.twitter}
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
${PROJECTS.map(p => `- ${p.title} [${p.tags.join(", ")}]: ${p.description} Details: ${p.route}; GitHub: ${p.github}; Live: ${p.live}`).join("\n")}

PORTFOLIO PAGES
${PORTFOLIO_PAGES.map(page => `- ${page.title} (${page.route}): ${page.summary}`).join("\n")}
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
  const routes = {
    home: "/",
    about: "/about",
    skills: "/skills",
    projects: "/projects",
    experience: "/experience",
    education: "/education",
    services: "/services",
    testimonials: "/testimonials",
    contact: "/contact",
    certificates: "/certificates",
    blog: "/blog",
    privacy: "/privacy",
    terms: "/terms",
  }
  const route = routes[sectionKey]
  if (!route) return false
  window.history.pushState({}, "", route)
  window.dispatchEvent(new PopStateEvent("popstate"))
  return true
}
