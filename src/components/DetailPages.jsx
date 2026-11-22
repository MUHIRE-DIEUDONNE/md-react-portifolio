import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiExternalLink, FiGithub, FiCheck, FiCalendar } from 'react-icons/fi'

const styles = `
  .detail-page {
    min-height: 100vh;
    padding: clamp(120px,12vw,170px) 20px clamp(80px,8vw,120px);
    background: #0c0b09;
    color: #f5eed8;
  }
  .detail-container { width: min(1040px,100%); margin:0 auto; }
  .detail-back {
    display:inline-flex; align-items:center; gap:8px; margin-bottom:28px;
    color:rgba(245,238,216,.62); text-decoration:none; font-size:12px;
  }
  .detail-title {
    margin:10px 0 14px; font-family:'Playfair Display',Georgia,serif;
    font-size:clamp(38px,7vw,72px); line-height:1.05;
  }
  .detail-lead { max-width:760px; color:rgba(245,238,216,.58); line-height:1.75; }
  .detail-hero {
    width:100%; height:clamp(220px,42vw,440px); object-fit:cover;
    margin:38px 0 26px; border-radius:24px; border:1px solid rgba(212,175,85,.18);
  }
  .detail-grid { display:grid; grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr); gap:18px; }
  .detail-card {
    padding:26px; border:1px solid rgba(255,245,220,.08); border-radius:20px;
    background:rgba(22,20,16,.92);
  }
  .detail-card h2,.detail-card h3 {
    margin-bottom:14px; font-family:'Playfair Display',Georgia,serif;
  }
  .detail-card p,.detail-card li { color:rgba(245,238,216,.58); line-height:1.75; font-size:14px; }
  .detail-list { list-style:none; display:grid; gap:9px; }
  .detail-list li { display:flex; align-items:flex-start; gap:8px; }
  .detail-actions { display:flex; flex-wrap:wrap; gap:10px; margin-top:22px; }
  .detail-action {
    min-height:46px; padding:0 18px; border-radius:999px; display:inline-flex;
    align-items:center; justify-content:center; gap:8px; text-decoration:none;
    border:1px solid rgba(212,175,85,.25); color:#d4af55; font-size:12px;
  }
  .detail-action.primary { background:#d4af55; color:#0c0b09; border-color:#d4af55; font-weight:700; }
  .detail-tags { display:flex; flex-wrap:wrap; gap:7px; }
  .detail-tag {
    padding:6px 11px; border-radius:999px; border:1px solid rgba(212,175,85,.24);
    color:#d4af55; background:rgba(212,175,85,.08); font-size:10px;
  }
  .detail-code{display:block;overflow-x:auto;margin-top:12px;padding:14px;border:1px solid rgba(212,175,85,.14);border-radius:12px;background:rgba(0,0,0,.32);color:#e6d9b8;font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre}
  .detail-sample{display:inline-flex;margin:12px 0;padding:6px 10px;border-radius:999px;background:rgba(212,175,85,.1);color:#d4af55;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
  @media(max-width:760px){
    .detail-page{padding-inline:16px}.detail-grid{grid-template-columns:1fr}.detail-hero{border-radius:16px}
  }
`

const projects = {
  'snake-game': {
    title: 'Snake Game',
    category: 'Game Development',
    description: 'A classic JavaScript Snake game with keyboard controls, score tracking, and progressive difficulty.',
    problem: 'Provide an accessible browser game that demonstrates core JavaScript state, animation, and keyboard interaction.',
    features: ['Keyboard controls', 'Score tracking', 'Progressive difficulty', 'Retro visual style'],
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Canvas API'],
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg',
    github: 'https://github.com/muhire-dieudonne/snake_game',
    live: 'https://muhire-dieudonne.github.io/snake_game/',
  },
  'jump-game-in-vue': {
    title: 'Jump Game in Vue',
    category: 'Game Development',
    description: 'An endless runner built with Vue.js, featuring obstacle handling, score logic, and smooth animation.',
    problem: 'Create a lightweight browser game that uses component state and animation to deliver an engaging experience.',
    features: ['Endless runner mechanics', 'Score system', 'Progressive obstacles', 'Responsive controls'],
    technologies: ['Vue.js', 'JavaScript', 'CSS3', 'HTML5'],
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg',
    github: 'https://github.com/muhire-dieudonne/jump_game_in_vue',
    live: 'https://muhire-dieudonne.github.io/jump_game_in_vue/',
  },
  'language-translator': {
    title: 'Language Translator',
    category: 'Web Application',
    description: 'A browser-based translation interface for sending text to a language API and presenting translated results.',
    problem: 'Make external translation services easier to access through a clear, responsive interface.',
    features: ['Language selection', 'Real-time translation requests', 'Copyable output', 'Responsive interface'],
    technologies: ['JavaScript', 'API Integration', 'HTML5', 'CSS3'],
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg',
    github: 'https://github.com/muhire-dieudonne/language_translator',
    live: 'https://muhire-dieudonne.github.io/language_translator/',
  },
  'money-converter': {
    title: 'Money Converter',
    category: 'Web Application',
    description: 'A currency conversion interface that applies exchange-rate API data in a clean user workflow.',
    problem: 'Help users compare currency values quickly without navigating complex financial interfaces.',
    features: ['Currency selection', 'Amount conversion', 'API exchange-rate data', 'Responsive layout'],
    technologies: ['JavaScript', 'API Integration', 'Chart.js', 'Responsive Design'],
    image: 'https://images.pexels.com/photos/4386425/pexels-photo-4386425.jpeg',
    github: 'https://github.com/muhire-dieudonne/money_converter',
    live: 'https://muhire-dieudonne.github.io/money_converter/',
  },
  '3d-interactive-portfolio': {
    title: '3-D Interactive Portfolio',
    category: 'Interactive Web',
    description: 'A React-based interactive portfolio featuring 3-D visuals, motion, and immersive presentation.',
    problem: 'Present a developer profile in an engaging form while preserving responsive navigation and usable content.',
    features: ['Three.js visuals', 'Motion effects', 'Responsive sections', 'Project navigation'],
    technologies: ['React', 'Three.js', 'Framer Motion', 'WebGL'],
    image: 'https://images.pexels.com/photos/777001/pexels-photo-777001.jpeg',
    github: 'https://github.com/muhire-dieudonne/3d-portfolio',
    live: 'https://muhire-dieudonne.github.io/portfolio/',
  },
}

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const project = projects[projectId]
  if (!project) return <DetailNotFound label="Project" back="/projects" />

  return (
    <section className="detail-page">
      <style>{styles}</style>
      <div className="detail-container">
        <Link className="detail-back" to="/projects"><FiArrowLeft />Back to projects</Link>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: '#d4af55', fontSize: 11, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>{project.category}</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="detail-title">{project.title}</motion.h1>
        <p className="detail-lead">{project.description}</p>
        <img className="detail-hero" src={project.image} alt={project.title} />
        <div className="detail-grid">
          <article className="detail-card">
            <h2>Project Overview</h2>
            <p>{project.problem}</p>
            <h3 style={{ marginTop: 24 }}>Main Features</h3>
            <ul className="detail-list">
              {project.features.map(feature => <li key={feature}><FiCheck size={14} color="#d4af55" />{feature}</li>)}
            </ul>
          </article>
          <aside className="detail-card">
            <h3>Technology Stack</h3>
            <div className="detail-tags">{project.technologies.map(tech => <span className="detail-tag" key={tech}>{tech}</span>)}</div>
            <div className="detail-actions">
              {project.live && <a className="detail-action primary" href={project.live} target="_blank" rel="noopener noreferrer"><FiExternalLink />Live demo</a>}
              {project.github && <a className="detail-action" href={project.github} target="_blank" rel="noopener noreferrer"><FiGithub />Source code</a>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

const articles = {
  'react-component-patterns': {
    title: 'React Component Patterns',
    category: 'React',
    date: 'Sample article',
    readingTime: '5 min read',
    intro: 'Reusable components are easier to maintain when they communicate clearly and keep responsibility focused.',
    sections: [
      ['Start with responsibilities', 'A component should represent a clear piece of UI and avoid owning unrelated application behavior. A profile card should display profile information; it should not also own application-wide routing or networking.'],
      ['Use props intentionally', 'Pass only the data and callbacks required by the component. A small, clear interface makes it easier to reuse the component and understand what controls its output.', "function SkillCard({ name, description }) {\n  return (\n    <article>\n      <h2>{name}</h2>\n      <p>{description}</p>\n    </article>\n  )\n}"],
      ['Keep state close', 'Place state at the nearest level that owns the behavior, and lift it only when multiple components need it. This avoids unnecessary shared state and makes updates predictable.'],
      ['Compose larger interfaces', 'Build a page from focused components and let parent layouts decide how they fit together. Prefer composition to a single component filled with unrelated conditional branches.'],
    ],
    takeaways: ['Give each component a clear responsibility.', 'Use props as an explicit data interface.', 'Keep state close to where it is used.', 'Test components in the states that matter.'],
  },
  'relational-database-basics': {
    title: 'Relational Database Basics',
    category: 'MySQL',
    date: 'Sample article',
    readingTime: '6 min read',
    intro: 'Relational databases organize data into tables and connect related records with keys and constraints.',
    sections: [
      ['Model entities', 'Start with the main records in a system, such as users, projects, and orders. Each table should represent one kind of entity and store fields that describe it.'],
      ['Add relationships', 'Use primary keys to identify records and foreign keys to express relationships. For example, an order can store a customer_id that points to a customer row.'],
      ['Query related data', 'SQL joins combine related rows for display or reporting. Start with the relationship and join condition, then select only the columns needed.', "SELECT orders.id, customers.name\nFROM orders\nJOIN customers\n  ON orders.customer_id = customers.id;"],
      ['Protect operations', 'Validate data before writing it and use transactions when multiple updates must succeed or fail together. Constraints provide an additional database-level guard.'],
    ],
    takeaways: ['Use stable primary keys.', 'Model relationships with foreign keys.', 'Use joins to retrieve related records.', 'Validate input and protect multi-step changes.'],
  },
  'planning-full-stack-app': {
    title: 'Planning a Full-Stack Application',
    category: 'Full Stack',
    date: 'Sample article',
    readingTime: '5 min read',
    intro: 'A practical build process begins with requirements and an honest plan before implementation.',
    sections: [
      ['Define the workflow', 'Identify the main user journey and the information needed to complete it. Write down what the user starts with, what they do, and what success looks like.'],
      ['Design the data', 'Create a database model and API contract before building UI screens. Agree on fields, validation errors, response shape, and permissions.'],
      ['Build one vertical feature', 'Implement a small workflow from screen to API to database, then verify the entire flow before duplicating the pattern. This reveals integration problems early.'],
      ['Test and deploy', 'Add validation and focused tests, then deploy with environment variables kept outside source control. Check a production-like build before release.'],
    ],
    takeaways: ['Clarify the user workflow.', 'Agree on data structures and API contracts.', 'Implement one complete feature at a time.', 'Validate configuration and test before deployment.'],
  },
  'javascript-async-basics': {
    title: 'JavaScript Async Basics',
    category: 'JavaScript',
    date: 'Sample article',
    readingTime: '4 min read',
    intro: 'Asynchronous code lets an application continue responding while waiting for work such as a network request.',
    sections: [
      ['Understand promises', 'A promise represents a value that may be available later. It can fulfill with a result or reject with an error.'],
      ['Use async and await', 'An async function returns a promise. Await makes asynchronous steps easier to read while preserving non-blocking behavior.', "async function loadProfile() {\n  const response = await fetch('/api/profile')\n  if (!response.ok) throw new Error('Request failed')\n  return response.json()\n}"],
      ['Handle failures', 'Network requests can fail, servers can return error statuses, and response data may be invalid. Handle these cases explicitly and show useful feedback.'],
    ],
    takeaways: ['Await promise-based operations.', 'Check HTTP response status.', 'Catch and communicate errors.', 'Do not assume network calls always succeed.'],
  },
  'responsive-html-css': {
    title: 'Responsive HTML and CSS',
    category: 'HTML & CSS',
    date: 'Sample article',
    readingTime: '4 min read',
    intro: 'Responsive interfaces use semantic markup and flexible layout rules so content adapts to available space.',
    sections: [
      ['Start with semantic HTML', 'Use elements that describe structure and purpose. Labels, headings, lists, and buttons improve accessibility and reduce custom behavior.'],
      ['Build flexible layouts', 'CSS Grid and Flexbox can distribute space without hard-coded widths. Minmax and fractional units help grid children shrink.', ".cards {\n  display: grid;\n  grid-template-columns: repeat(\n    auto-fit, minmax(min(100%, 240px), 1fr)\n  );\n  gap: 1rem;\n}"],
      ['Test real widths', 'Check narrow phones, tablets, and wide displays. Look for overflow, clipped labels, tiny touch targets, and text that becomes difficult to scan.'],
    ],
    takeaways: ['Use semantic elements.', 'Prefer flexible sizing to fixed widths.', 'Test narrow and wide layouts.', 'Ensure controls are keyboard and touch accessible.'],
  },
  'node-express-rest-api': {
    title: 'Node and Express REST APIs',
    category: 'Node.js & Express',
    date: 'Sample article',
    readingTime: '5 min read',
    intro: 'A REST API exposes resources through HTTP routes and communicates using predictable request and response data.',
    sections: [
      ['Choose meaningful resources', 'Design routes around resources such as /api/tasks rather than action names. Use HTTP methods to express the operation.'],
      ['Validate incoming data', 'Treat request bodies and parameters as untrusted input. Validate required fields, expected types, and allowed values before calling application logic.'],
      ['Return useful status codes', 'Use status codes to distinguish success, invalid input, missing data, and unexpected server errors.', "app.get('/api/tasks/:id', async (req, res, next) => {\n  try {\n    const task = await findTask(req.params.id)\n    if (!task) return res.sendStatus(404)\n    res.json(task)\n  } catch (error) {\n    next(error)\n  }\n})"],
    ],
    takeaways: ['Use resource-oriented routes.', 'Validate request data.', 'Return clear status codes and response shapes.', 'Centralize unexpected error handling.'],
  },
  'php-form-processing': {
    title: 'PHP Form Processing',
    category: 'PHP',
    date: 'Sample article',
    readingTime: '4 min read',
    intro: 'Server-side form handling must validate input even when the browser already provides client-side checks.',
    sections: [
      ['Validate on the server', 'Client-side validation improves usability, but server validation is required because requests can bypass the browser interface.'],
      ['Use safe database operations', 'Use parameterized queries instead of joining raw input into SQL strings. Escape data appropriately when rendering it in HTML.'],
      ['Give clear feedback', 'Return field-specific errors and preserve safe form values when validation fails. Avoid reporting success until the application has completed the operation.'],
    ],
    takeaways: ['Never rely only on browser validation.', 'Use parameterized queries.', 'Escape output by context.', 'Report success only after persistence succeeds.'],
  },
  'sql-joins': {
    title: 'SQL Joins',
    category: 'MySQL',
    date: 'Sample article',
    readingTime: '4 min read',
    intro: 'A join combines rows from related tables so an application can present connected information together.',
    sections: [
      ['Join matching records', 'An inner join returns rows where the join condition matches on both sides. It is useful when both records must exist.'],
      ['Include optional relationships', 'A left join keeps every row from the left-hand table and includes matching right-hand data when present.'],
      ['Keep query results focused', 'Select only required columns, make join conditions explicit, and use indexes on frequently joined keys.', "SELECT members.name, loans.amount\nFROM members\nLEFT JOIN loans\n  ON loans.member_id = members.id;"],
    ],
    takeaways: ['Choose inner or left joins based on the needed result.', 'Join on related keys.', 'Select only the fields needed.', 'Review query behavior with representative data.'],
  },
}

export function ArticleDetailPage() {
  const { articleId } = useParams()
  const article = articles[articleId]
  if (!article) return <DetailNotFound label="Article" back="/blog" />

  return (
    <article className="detail-page">
      <style>{styles}</style>
      <div className="detail-container">
        <Link className="detail-back" to="/blog"><FiArrowLeft />Back to articles</Link>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, color: '#d4af55', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em' }}>
          <span>{article.category}</span><span><FiCalendar /> {article.date}</span><span>{article.readingTime}</span>
        </div>
        <span className="detail-sample">Sample learning article</span>
        <h1 className="detail-title">{article.title}</h1>
        <p className="detail-lead">{article.intro}</p>
        <div className="detail-grid" style={{ marginTop: 38 }}>
          <div>
            {article.sections.map(([heading, text, code]) => (
              <div className="detail-card" style={{ marginBottom: 14 }} key={heading}>
                <h2 style={{ fontSize: 22 }}>{heading}</h2>
                <p>{text}</p>
                {code && <pre className="detail-code"><code>{code}</code></pre>}
              </div>
            ))}
          </div>
          <aside className="detail-card">
            <h3>Key takeaways</h3>
            <ul className="detail-list">
              {article.takeaways.map(item => <li key={item}><FiCheck size={14} color="#d4af55" />{item}</li>)}
            </ul>
            <h3 style={{ marginTop: 24 }}>Related topics</h3>
            <div className="detail-tags"><span className="detail-tag">{article.category}</span><span className="detail-tag">Full Stack</span><span className="detail-tag">Web Development</span></div>
          </aside>
        </div>
      </div>
    </article>
  )
}

function DetailNotFound({ label, back }) {
  return (
    <section className="detail-page">
      <style>{styles}</style>
      <div className="detail-container">
        <h1 className="detail-title">{label} not found</h1>
        <Link className="detail-action primary" to={back}><FiArrowLeft />Go back</Link>
      </div>
    </section>
  )
}
