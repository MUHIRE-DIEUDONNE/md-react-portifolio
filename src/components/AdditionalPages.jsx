import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiAward, FiBookOpen, FiBriefcase, FiCheck, FiCode, FiDatabase, FiLayers, FiMessageCircle, FiMonitor, FiShield } from 'react-icons/fi'

const styles = `
  .additional-page {
    min-height: 100vh;
    padding: clamp(120px, 12vw, 180px) 20px clamp(80px, 8vw, 120px);
    background: #0c0b09;
    color: #f5eed8;
  }
  .additional-page-container {
    width: min(1120px, 100%);
    margin: 0 auto;
  }
  .additional-eyebrow {
    color: #d4af55;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
  }
  .additional-title {
    margin: 12px 0 18px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(42px, 7vw, 76px);
    line-height: 1;
  }
  .additional-intro {
    max-width: 680px;
    color: rgba(245,238,216,.58);
    font-size: clamp(15px, 2vw, 18px);
    line-height: 1.75;
  }
  .additional-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-top: 48px;
  }
  .additional-card {
    min-height: 220px;
    padding: 28px;
    border: 1px solid rgba(255,245,220,.08);
    border-radius: 22px;
    background: rgba(22,20,16,.92);
  }
  .additional-icon {
    width: 44px;
    height: 44px;
    margin-bottom: 22px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    color: #d4af55;
    background: rgba(212,175,85,.12);
  }
  .additional-card h3 {
    margin-bottom: 10px;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 21px;
  }
  .additional-card p {
    color: rgba(245,238,216,.52);
    line-height: 1.75;
    font-size: 13px;
  }
  .additional-list {
    display: grid;
    gap: 9px;
    margin-top: 16px;
  }
  .additional-list span {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(245,238,216,.68);
    font-size: 12px;
  }
  .additional-action {
    display: inline-flex;
    margin-top: 38px;
    align-items: center;
    justify-content: center;
    min-height: 48px;
    padding: 0 24px;
    border-radius: 999px;
    background: #d4af55;
    color: #0c0b09;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 840px) {
    .additional-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 560px) {
    .additional-page { padding-inline: 16px; }
    .additional-grid { grid-template-columns: 1fr; gap: 12px; margin-top: 32px; }
    .additional-card { min-height: 0; padding: 22px; }
  }
  .additional-tools {
    display:flex; gap:10px; flex-wrap:wrap; margin-top:28px;
  }
  .additional-search {
    flex:1 1 260px; min-height:46px; border-radius:12px;
    border:1px solid rgba(212,175,85,.18); background:rgba(22,20,16,.8);
    color:#f5eed8; padding:0 14px; outline:none;
  }
  html.light-mode .additional-search{background:#fff;color:#0f172a}
  .additional-filter {
    min-height:46px; border-radius:999px; border:1px solid rgba(212,175,85,.18);
    background:transparent; color:#d4af55; padding:0 14px;
  }
`

const pageData = {
  education: {
    eyebrow: 'Academic Foundation',
    title: 'Education',
    intro: "A strong software-development foundation combining computer science principles, modern engineering, and continuous hands-on learning.",
    cards: [
      { icon: FiBookOpen, title: "Bachelor's Degree", text: 'Bachelor of Science in Software Development from the University of Rwanda.', items: ['Software engineering', 'Database systems', 'Web application development'] },
      { icon: FiAward, title: 'Professional Learning', text: 'Focused learning in React, 3-D web experiences, backend architecture, and product delivery.', items: ['React and TypeScript', 'Three.js and WebGL', 'Full-stack development'] },
      { icon: FiShield, title: 'Working Principles', text: 'Clean architecture, accessibility, security awareness, testing, and maintainable code.', items: ['Responsive interfaces', 'Secure data handling', 'Continuous improvement'] },
    ],
  },
  services: {
    eyebrow: 'What I Build',
    title: 'Services',
    intro: 'End-to-end web development services for businesses, startups, organizations, and independent teams. Each engagement begins with requirements, a practical technical plan, implementation, testing, and a clear handover.',
    cards: [
      { icon: FiMonitor, title: 'Frontend Web Development', text: 'Responsive interfaces built with reusable components and accessible interactions.', items: ['React and JavaScript', 'Responsive layouts', 'Browser testing'] },
      { icon: FiCode, title: 'Full-Stack Development', text: 'Complete web applications connecting a polished interface to structured server-side logic.', items: ['Frontend and API integration', 'Authentication flows', 'Database-backed features'] },
      { icon: FiMonitor, title: 'React Application Development', text: 'Maintainable React applications with clear routing, state management, and reusable UI patterns.', items: ['Component architecture', 'Form validation', 'API state handling'] },
      { icon: FiDatabase, title: 'Backend API Development', text: 'Node.js or PHP APIs designed around secure, predictable request and response flows.', items: ['REST endpoint design', 'Server validation', 'Third-party integrations'] },
      { icon: FiDatabase, title: 'Database Solutions', text: 'MySQL database models, SQL queries, relationships, CRUD operations, and reporting needs.', items: ['Schema design', 'Data relationships', 'Query optimization'] },
      { icon: FiLayers, title: 'Responsive Website Development', text: 'Mobile-first websites that remain readable and usable across phones, tablets, laptops, and desktops.', items: ['320px to 1440px layouts', 'Touch-friendly controls', 'Cross-device testing'] },
      { icon: FiShield, title: 'Website Maintenance', text: 'Focused maintenance for updates, bug fixes, content changes, performance, and deployment.', items: ['Bug investigation', 'Dependency updates', 'Deployment support'] },
      { icon: FiBriefcase, title: 'Technical Consultation', text: 'Practical advice on technology choices, project structure, implementation risks, and delivery planning.', items: ['Requirements review', 'Architecture guidance', 'Implementation roadmap'] },
    ],
  },
  testimonials: {
    eyebrow: 'Collaboration',
    title: 'Testimonials',
    intro: 'No verified client testimonials or quotations are listed yet. This section presents the working principles Muhire brings to client and team collaboration.',
    cards: [
      { icon: FiMessageCircle, title: 'Clear Communication', text: 'Set expectations clearly, explain technical decisions, and keep progress visible.' },
      { icon: FiCheck, title: 'Practical Execution', text: 'Focus on working features, responsive behavior, maintainable code, and measurable project goals.' },
      { icon: FiBriefcase, title: 'Collaborative Delivery', text: 'Ask for feedback early, document decisions, and adapt the implementation when project needs change.' },
    ],
  },
  certificates: {
    eyebrow: 'Professional Achievements',
    title: 'Certificates',
    intro: 'Verified certificate documents will be displayed here only when an official title, issuer, date, and verification source are available.',
    cards: [],
  },
  blog: {
    eyebrow: 'Developer Articles',
    title: 'Blog',
    intro: 'A practical collection of clearly labeled sample articles covering React, full-stack development, JavaScript, PHP, and databases.',
    cards: [
      { icon: FiMonitor, title: 'Sample: React Component Patterns', text: 'A practical introduction to reusable components, props, composition, and accessible state management.' },
      { icon: FiDatabase, title: 'Sample: Relational Database Basics', text: 'Understand tables, relationships, primary keys, foreign keys, SQL queries, and CRUD operations.' },
      { icon: FiLayers, title: 'Sample: Planning a Full-Stack App', text: 'A beginner-friendly workflow from requirements and database design to API and interface implementation.' },
      { icon: FiCode, title: 'Sample: JavaScript Async Basics', text: 'Understand promises, async functions, and how to handle request failures.' },
      { icon: FiMonitor, title: 'Sample: Responsive HTML and CSS', text: 'Use semantic structure and flexible layouts to support different screen widths.' },
      { icon: FiDatabase, title: 'Sample: Node and Express REST APIs', text: 'Learn routes, HTTP methods, request validation, and JSON responses.' },
      { icon: FiCode, title: 'Sample: PHP Form Processing', text: 'Explore server-side validation, safe input handling, and clear form feedback.' },
      { icon: FiDatabase, title: 'Sample: SQL Joins', text: 'Combine related records in relational queries and understand when joins are useful.' },
    ],
  },
  privacy: {
    eyebrow: 'Website Information',
    title: 'Privacy Policy',
    intro: 'This portfolio does not intentionally sell personal data. Information submitted through a configured email or form service is used only to respond to the user.',
    cards: [
      { icon: FiShield, title: 'Information Use', text: 'Contact details are used to respond to enquiries and should not be published publicly.' },
      { icon: FiMonitor, title: 'Local Preferences', text: 'Theme preferences may be stored locally in your browser for a consistent experience.' },
      { icon: FiCheck, title: 'External Links', text: 'Social and project links lead to third-party websites that have their own privacy policies.' },
    ],
  },
  terms: {
    eyebrow: 'Website Terms',
    title: 'Terms of Use',
    intro: 'Portfolio content is provided for professional and informational purposes. Project and article descriptions reflect the work or sample material presented on this site.',
    cards: [
      { icon: FiCheck, title: 'Acceptable Use', text: 'Do not misuse the site, interfere with its operation, or attempt unauthorized access.' },
      { icon: FiShield, title: 'Content and Links', text: 'External resources are provided for convenience and do not imply endorsement of unrelated third-party content.' },
      { icon: FiBriefcase, title: 'Project Enquiries', text: 'A portfolio enquiry does not create a contract. Scope, timing, and pricing require separate agreement.' },
    ],
  },
}

const blogArticles = [
  { title: 'Sample: React Component Patterns', slug: 'react-component-patterns', category: 'React' },
  { title: 'Sample: Relational Database Basics', slug: 'relational-database-basics', category: 'MySQL' },
  { title: 'Sample: Planning a Full-Stack App', slug: 'planning-full-stack-app', category: 'Full Stack' },
  { title: 'Sample: JavaScript Async Basics', slug: 'javascript-async-basics', category: 'JavaScript' },
  { title: 'Sample: Responsive HTML and CSS', slug: 'responsive-html-css', category: 'HTML & CSS' },
  { title: 'Sample: Node and Express REST APIs', slug: 'node-express-rest-api', category: 'Node.js & Express' },
  { title: 'Sample: PHP Form Processing', slug: 'php-form-processing', category: 'PHP' },
  { title: 'Sample: SQL Joins', slug: 'sql-joins', category: 'MySQL' },
]

export function TechnicalSkillsPage() {
  const groups = [
    { icon: FiCode, title: 'Frontend', text: 'HTML5, CSS3, JavaScript, React, and Tailwind CSS.', usage: 'Responsive interfaces, reusable components, state management, and accessible interactions.' },
    { icon: FiDatabase, title: 'Backend', text: 'Node.js, Express.js, PHP, and REST API development.', usage: 'Server-side routes, request validation, authentication, and application APIs.' },
    { icon: FiDatabase, title: 'Database', text: 'MySQL, database design, SQL queries, and CRUD operations.', usage: 'Structured data models, relationships, migrations, and data retrieval.' },
    { icon: FiMonitor, title: 'Programming', text: 'JavaScript and Python.', usage: 'Application logic, scripting, automation, and web development tasks.' },
    { icon: FiLayers, title: 'Tools', text: 'Git, GitHub, VS Code, and Postman.', usage: 'Version control, source review, development workflows, and API testing.' },
  ]

  return (
    <section className="additional-page">
      <style>{styles}</style>
      <div className="additional-page-container">
        <p className="additional-eyebrow">Technical Profile</p>
        <h1 className="additional-title">Skills</h1>
        <p className="additional-intro">A practical technology toolkit organized by the areas used to plan, build, test, and maintain web applications.</p>
        <div className="additional-grid">
          {groups.map((group, index) => (
            <motion.article
              className="additional-card"
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <div className="additional-icon"><group.icon size={20} /></div>
              <h3>{group.title}</h3>
              <p>{group.text}</p>
              <p style={{ marginTop: 12 }}>{group.usage}</p>
            </motion.article>
          ))}
        </div>
        {page === 'certificates' && (
          <div role="status" style={{ marginTop: 32, padding: 'clamp(24px,5vw,48px)', textAlign: 'center', border: '1px dashed rgba(212,175,85,.3)', borderRadius: 20, background: 'rgba(212,175,85,.04)' }}>
            <FiAward size={30} color="#d4af55" />
            <h2 style={{ margin: '14px 0 8px', fontFamily: "'Playfair Display',Georgia,serif" }}>No verified certificates available</h2>
            <p style={{ maxWidth: 560, margin: '0 auto', color: 'rgba(245,238,216,.58)', lineHeight: 1.7 }}>
              No certificate images, issuers, dates, or verification links have been provided. This page will show credentials here once official supporting details are available.
            </p>
          </div>
        )}
        <Link className="additional-action" to="/projects">See technologies in projects</Link>
      </div>
    </section>
  )
}

export default function AdditionalPage({ page }) {
  const content = pageData[page] || pageData.services
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const blogCards = useMemo(() => {
    if (page !== 'blog') return content.cards
    return content.cards.filter((card) => {
      const category = blogArticles.find(article => article.title === card.title)?.category || ''
      const matchesCategory = filter === 'All' || category === filter
      const matchesSearch = `${card.title} ${card.text}`.toLowerCase().includes(search.trim().toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [page, content.cards, search, filter])

  return (
    <section className="additional-page">
      <style>{styles}</style>
      <div className="additional-page-container">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="additional-eyebrow">
          {content.eyebrow}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="additional-title">
          {content.title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .16 }} className="additional-intro">
          {content.intro}
        </motion.p>

        {page === 'blog' && (
          <div className="additional-tools">
            <input
              className="additional-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
            />
            <select
              className="additional-filter"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter articles"
            >
              <option>All</option>
              <option>React</option>
              <option>JavaScript</option>
              <option>HTML &amp; CSS</option>
              <option>Node.js &amp; Express</option>
              <option>PHP</option>
              <option>MySQL</option>
              <option>Full Stack</option>
            </select>
          </div>
        )}

        <div className="additional-grid">
          {blogCards.map((card, index) => (
            <motion.article
              key={card.title}
              className="additional-card"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .12 + index * .08 }}
            >
              <div className="additional-icon"><card.icon size={20} /></div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              {card.items && (
                <div className="additional-list">
                  {card.items.map(item => <span key={item}><FiCheck size={12} color="#d4af55" />{item}</span>)}
                </div>
              )}
              {page === 'blog' && (
                <Link
                  className="additional-action"
                  style={{ marginTop: 20, minHeight: 40, paddingInline: 16 }}
                  to={`/blog/${blogArticles.find(article => article.title === card.title)?.slug || 'react-component-patterns'}`}
                >
                  Read sample article
                </Link>
              )}
            </motion.article>
          ))}
        </div>
        <Link className="additional-action" to="/contact">Start a project</Link>
      </div>
    </section>
  )
}
