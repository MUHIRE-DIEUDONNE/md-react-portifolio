import React, { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FiActivity, FiArrowRight, FiAward, FiBookOpen, FiBriefcase, FiCheck,
  FiCode, FiDatabase, FiDownload, FiGithub, FiLayers, FiLinkedin, FiMail,
  FiMonitor, FiTarget, FiTool, FiZap
} from 'react-icons/fi'
import profilePhoto from '../images/Muhire_dieudonne.JPG'

const ThreeHero = lazy(() => import('./ThreeHero'))

const styles = `
  .pro-page{min-height:100vh;padding:112px 20px 96px;background:var(--page-bg,#0c0b09);color:var(--page-text,#f5eed8);overflow:hidden}
  html.light-mode .pro-page{--page-bg:#f8fafc;--page-text:#0f172a}
  .pro-container{width:min(1120px,100%);margin:0 auto}
  .pro-kicker{display:flex;align-items:center;gap:10px;color:#d4af55;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
  .pro-kicker:before{content:'';width:28px;height:1px;background:#d4af55}
  .pro-title{margin:14px 0 18px;font-family:'Playfair Display',Georgia,serif;font-size:clamp(40px,7vw,76px);line-height:1.03;letter-spacing:-.025em}
  .pro-title em{color:#d4af55}
  .pro-lead{max-width:720px;color:rgba(245,238,216,.58);font-size:clamp(15px,2vw,18px);line-height:1.75}
  html.light-mode .pro-lead{color:#64748b}
  .pro-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin-top:38px}
  .pro-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}
  .pro-card{position:relative;padding:24px;border:1px solid rgba(212,175,85,.11);border-radius:18px;background:rgba(22,20,16,.82);backdrop-filter:blur(12px)}
  html.light-mode .pro-card{background:#fff;border-color:rgba(15,23,42,.08);box-shadow:0 12px 40px rgba(15,23,42,.06)}
  .pro-icon{width:42px;height:42px;display:grid;place-items:center;margin-bottom:18px;border-radius:12px;background:rgba(212,175,85,.12);color:#d4af55}
  .pro-card h3{font-family:'Playfair Display',Georgia,serif;font-size:20px;margin-bottom:9px}
  .pro-card p,.pro-card li{color:rgba(245,238,216,.56);font-size:13px;line-height:1.72}
  html.light-mode .pro-card p,html.light-mode .pro-card li{color:#64748b}
  .pro-card ul{list-style:none;margin-top:14px;display:grid;gap:8px}
  .pro-card li{display:flex;align-items:flex-start;gap:8px}
  .pro-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}
  .pro-button{min-height:48px;padding:0 20px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;gap:8px;text-decoration:none;border:1px solid rgba(212,175,85,.28);color:#d4af55;font-size:12px;font-weight:800;letter-spacing:.04em}
  .pro-button.primary{background:#d4af55;color:#0c0b09;border-color:#d4af55}
  .pro-hr{height:1px;margin:64px 0 38px;background:linear-gradient(90deg,#d4af55,rgba(212,175,85,.12),transparent)}
  .pro-section-title{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4vw,44px);margin-bottom:12px}
  .pro-section-lead{max-width:680px;color:rgba(245,238,216,.52);line-height:1.75}
  html.light-mode .pro-section-lead{color:#64748b}
  @media(max-width:840px){.pro-grid,.pro-grid.two{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .pro-project-image{width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:16px}
  .pro-project-image-placeholder{height:160px;border-radius:12px;margin-bottom:16px;padding:20px;display:grid;place-items:center;text-align:center;background:linear-gradient(135deg,rgba(212,175,85,.12),rgba(46,204,154,.06));border:1px solid rgba(212,175,85,.14);color:#d4af55;font-family:'Playfair Display',Georgia,serif;font-size:23px}
  .pro-about-profile{display:grid;grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr);align-items:start;gap:32px;margin-top:38px}
  .pro-about-photo{display:block;width:100%;max-width:380px;aspect-ratio:4/5;object-fit:cover;border-radius:20px;border:1px solid rgba(212,175,85,.2)}
  .pro-about-download{justify-content:center}
  .pro-home-visual{position:relative;width:100%;height:clamp(340px,42vw,500px);overflow:hidden;isolation:isolate;border:1px solid rgba(212,175,85,.2);border-radius:28px;background:radial-gradient(circle at 50% 45%,rgba(20,54,78,.52),rgba(12,11,9,.96) 68%);box-shadow:0 28px 80px rgba(0,0,0,.24)}
  .pro-home-canvas{position:absolute;inset:0}
  .pro-home-canvas-fallback{position:absolute;inset:0;display:grid;place-items:center;color:rgba(245,238,216,.6);font-size:12px;letter-spacing:.08em;text-transform:uppercase}
  .pro-home-visual-caption{position:absolute;z-index:2;top:18px;left:18px;padding:9px 12px;border:1px solid rgba(212,175,85,.2);border-radius:999px;background:rgba(12,11,9,.62);color:#e6d9b8;font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(12px);pointer-events:none}
  .pro-home-profile{position:absolute;z-index:2;left:18px;bottom:18px;display:flex;align-items:center;gap:11px;padding:9px 16px 9px 9px;border:1px solid rgba(212,175,85,.24);border-radius:18px;background:rgba(12,11,9,.78);backdrop-filter:blur(14px);box-shadow:0 12px 32px rgba(0,0,0,.24);pointer-events:none}
  .pro-home-profile img{width:46px;height:46px;object-fit:cover;border-radius:13px;border:1px solid rgba(212,175,85,.42)}
  .pro-home-profile strong,.pro-home-profile small{display:block}
  .pro-home-profile strong{color:#f5eed8;font-size:12px}
  .pro-home-profile small{margin-top:4px;color:rgba(245,238,216,.55);font-size:10px}
  @media(max-width:760px){.pro-home-hero{grid-template-columns:1fr!important;gap:32px!important;min-height:0!important}.pro-home-visual{max-width:480px;height:clamp(320px,78vw,420px);margin:0 auto}.pro-about-profile{grid-template-columns:minmax(0,1fr);gap:24px}.pro-about-photo{width:min(100%,380px);margin:0 auto}}
  @media(max-width:560px){.pro-page{padding:88px 16px 72px}.pro-grid,.pro-grid.two{grid-template-columns:1fr}.pro-card{padding:20px}.pro-actions{display:grid}.pro-button{width:100%}}
`

export function ProfessionalHome() {
  const [titleIndex, setTitleIndex] = React.useState(0)
  const prefersReducedMotion = useReducedMotion()
  const titles = ['Full Stack Developer', 'React Developer', 'Software Developer']
  React.useEffect(() => {
    const timer = setInterval(() => setTitleIndex(i => (i + 1) % titles.length), 2600)
    return () => clearInterval(timer)
  }, [])

  const services = [
    ['Frontend Development', FiMonitor, 'Responsive, accessible interfaces using modern component-based development.'],
    ['Backend Development', FiDatabase, 'Server-side application logic, APIs, authentication, and data workflows.'],
    ['Full Stack Applications', FiLayers, 'Complete solutions connecting user interfaces, services, and databases.'],
  ]
  const strengths = [
    ['Problem solving', 'Breaking requirements into clear, testable implementation decisions.'],
    ['Clean delivery', 'Readable code, responsive layouts, and maintainable project structure.'],
    ['Continuous learning', 'Improving through real projects, documentation, and technical study.'],
  ]
  const stack = [
    ['React', 'JavaScript', 'HTML5', 'CSS3'],
    ['Node.js', 'Express.js', 'PHP', 'REST APIs'],
    ['MySQL', 'Python', 'Git', 'GitHub'],
  ]

  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <div className="pro-home-hero" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(260px,.85fr)', gap: 48, alignItems: 'center', minHeight: 'calc(100vh - 180px)' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="pro-kicker">Muhire Dieudonne</p>
            <h1 className="pro-title">Building Digital Solutions That <em>Make a Difference.</em></h1>
            <motion.p key={titleIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ color: '#d4af55', fontWeight: 700, marginBottom: 16 }}>
              {titles[titleIndex]}
            </motion.p>
            <p className="pro-lead">
              I am a Full Stack Developer based in Rwanda, interested in building modern, useful, and reliable web applications.
              I combine frontend engineering, backend development, database design, and a practical problem-solving approach
              to turn real requirements into working software.
            </p>
            <div className="pro-actions">
              <Link className="pro-button primary" to="/projects">Explore My Work <FiArrowRight /></Link>
              <Link className="pro-button" to="/about">About Me</Link>
              <Link className="pro-button" to="/contact">Hire Me</Link>
              <a className="pro-button" href="/MUHIRE_DIEUDONNE_CV.pdf" download="Muhire_Dieudonne_CV.pdf"><FiDownload />Download CV</a>
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 24, flexWrap: 'wrap' }}>
              <a href="https://github.com/MUHIRE-DIEUDONNE" target="_blank" rel="noreferrer" style={{ color: '#d4af55' }} aria-label="GitHub"><FiGithub size={18} /></a>
              <a href="https://www.linkedin.com/in/muhire-dieudonne-498845419/" target="_blank" rel="noreferrer" style={{ color: '#d4af55' }} aria-label="LinkedIn"><FiLinkedin size={18} /></a>
              <a href="mailto:muhiredieu7@gmail.com" style={{ color: '#d4af55' }} aria-label="Email"><FiMail size={18} /></a>
            </div>
          </motion.div>
          <motion.div className="pro-home-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="pro-home-canvas" aria-hidden="true">
              <Suspense fallback={<div className="pro-home-canvas-fallback">Loading 3D experience…</div>}>
                <ThreeHero
                  mousePosition={null}
                  orbitSpeed={prefersReducedMotion ? 0.3 : 0.72}
                  cameraPosition={[0, 1, 9]}
                />
              </Suspense>
            </div>
            <span className="pro-home-visual-caption">Interactive Three.js experience</span>
            <div className="pro-home-profile">
              <img src={profilePhoto} alt="" />
              <span><strong>Muhire Dieudonne</strong><small>Full-Stack Developer · Rwanda</small></span>
            </div>
          </motion.div>
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">A Practical, User-Focused Approach</h2>
        <p className="pro-section-lead">
          I am interested in software that makes everyday work clearer, faster, or more accessible. My approach starts by understanding the intended users and the problem, then choosing a suitable implementation, testing expected behavior, and improving the result based on feedback.
        </p>
        <div className="pro-grid">
          {[
            ['Understand the need', 'Clarify the user, workflow, constraints, and desired outcome before choosing a technical solution.'],
            ['Build for use', 'Balance visual clarity with reliable application behavior, accessible controls, and responsive layouts.'],
            ['Maintain the result', 'Keep code understandable, validate important behavior, and leave room for future improvements.'],
          ].map(([title, text]) => <article className="pro-card" key={title}><div className="pro-icon"><FiTarget /></div><h3>{title}</h3><p>{text}</p></article>)}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">What I Do</h2>
        <p className="pro-section-lead">I design and implement software across the stack, with attention to usability, maintainability, data structure, and real project needs.</p>
        <div className="pro-grid">
          {services.map(([title, Icon, text]) => (
            <article className="pro-card" key={title}>
              <div className="pro-icon"><Icon /></div><h3>{title}</h3><p>{text}</p>
              <Link className="pro-button" style={{ marginTop: 16 }} to="/services">Explore Services <FiArrowRight /></Link>
            </article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Technology Stack</h2>
        <div className="pro-grid">
          {stack.map((group, index) => (
            <article className="pro-card" key={index}>
              <div className="pro-icon">{index === 0 ? <FiCode /> : index === 1 ? <FiZap /> : <FiDatabase />}</div>
              <h3>{index === 0 ? 'Frontend' : index === 1 ? 'Backend' : 'Data & Tools'}</h3>
              <ul>{group.map(item => <li key={item}><FiCheck color="#d4af55" />{item}</li>)}</ul>
            </article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Featured Projects</h2>
        <p className="pro-section-lead">A selection of practical applications and interactive software available in this portfolio.</p>
        <div className="pro-grid">
          {[
            ['Snake Game', 'A JavaScript browser game demonstrating state, animation, controls, and Canvas API concepts.', '/projects/snake-game', 'https://github.com/muhire-dieudonne/snake_game'],
            ['Language Translator', 'A web application interface for sending text to language translation services.', '/projects/language-translator', 'https://github.com/muhire-dieudonne/language_translator'],
            ['Money Converter', 'A responsive currency conversion interface using exchange-rate API data.', '/projects/money-converter', 'https://github.com/muhire-dieudonne/money_converter'],
          ].map(([title, text, route, github]) => (
            <article className="pro-card" key={title}>
              <div className="pro-project-image-placeholder" aria-hidden="true">{title}</div>
              <h3>{title}</h3><p>{text}</p>
              <p style={{ marginTop: 10, fontSize: 11 }}>Project links and details are provided from the linked repository. Preview artwork is illustrative, not a project screenshot.</p>
              <div className="pro-actions"><Link className="pro-button primary" to={route}>View Details</Link><a className="pro-button" href={github} target="_blank" rel="noreferrer"><FiGithub />Code</a></div>
            </article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Why Work With Me</h2>
        <div className="pro-grid">
          {strengths.map(([title, text]) => (
            <article className="pro-card" key={title}><div className="pro-icon"><FiTarget /></div><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Development Process</h2>
        <div className="pro-grid">
          {[
            ['01', 'Understand', 'Clarify goals, users, constraints, and required features.'],
            ['02', 'Plan', 'Outline architecture, data flow, components, and implementation milestones.'],
            ['03', 'Build', 'Develop responsive interfaces and server or database functionality.'],
            ['04', 'Test', 'Validate behavior, responsiveness, errors, and edge cases.'],
            ['05', 'Deploy', 'Prepare the application for hosting and document usage.'],
            ['06', 'Maintain', 'Improve, debug, update, and support the delivered solution.'],
          ].map(([number, title, text]) => (
            <article className="pro-card" key={number}><p style={{ color: '#d4af55', fontWeight: 800 }}>{number}</p><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Latest Learning Resources</h2>
        <p className="pro-section-lead">Short practical sample articles focused on foundations that are useful across projects. They are labeled as sample content in the article collection.</p>
        <div className="pro-grid">
          {[
            ['React Component Patterns', 'Reusable components, props, composition, and state ownership.', '/blog/react-component-patterns'],
            ['Relational Database Basics', 'Tables, relationships, keys, SQL, and CRUD workflows.', '/blog/relational-database-basics'],
            ['Planning a Full-Stack Application', 'Move from requirements to data models, API contracts, testing, and deployment.', '/blog/planning-full-stack-app'],
          ].map(([title, text, path]) => <article className="pro-card" key={path}><div className="pro-icon"><FiBookOpen /></div><h3>{title}</h3><p>{text}</p><Link className="pro-button" style={{ marginTop: 16 }} to={path}>Read Sample <FiArrowRight /></Link></article>)}
        </div>

        <div className="pro-hr" />
        <article className="pro-card" style={{ textAlign: 'center', padding: 'clamp(28px,5vw,52px)' }}>
          <p className="pro-kicker" style={{ justifyContent: 'center' }}>Start a Conversation</p>
          <h2 className="pro-section-title">Have a project or opportunity in mind?</h2>
          <p className="pro-section-lead" style={{ margin: '0 auto' }}>Share your goals, current challenge, or required technologies. I will respond with next steps and practical questions.</p>
          <div className="pro-actions" style={{ justifyContent: 'center' }}><Link className="pro-button primary" to="/contact">Contact Me <FiMail /></Link><Link className="pro-button" to="/services">View Services</Link></div>
        </article>
      </div>
    </section>
  )
}

export function ProfessionalEducation() {
  const cards = [
    ["Bachelor in Technology of Information Technology","Muhire studied at RP Tumba College in Kigali, Rwanda.",['RP Tumba College','Information Technology','Kigali, Rwanda']],
    ['Technical Practice','Hands-on development through personal and academic projects across frontend, backend, and data workflows.',['HTML, CSS, JavaScript','React and PHP','MySQL and REST APIs']],
    ['Current Learning Interests','Ongoing study of modern web architecture, maintainable code, testing, security, deployment, and mobile development.',['Mobile applications','Software architecture','Emerging technologies']],
  ]
  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <p className="pro-kicker">Academic and Technical Background</p>
        <h1 className="pro-title">Education & <em>Learning</em></h1>
        <p className="pro-lead">My education and technical learning focus on software development, programming foundations, web technologies, database systems, and the ability to turn theoretical concepts into practical projects.</p>
        <div className="pro-grid" style={{ marginTop: 42 }}>
          {cards.map(([title, text, items]) => (
            <article className="pro-card" key={title}>
              <div className="pro-icon"><FiAward /></div><h3>{title}</h3><p>{text}</p>
              <ul>{items.map(item => <li key={item}><FiCheck color="#d4af55" />{item}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="pro-hr" />
        <h2 className="pro-section-title">How Education Supports My Work</h2>
        <div className="pro-grid">
          {[
            ['Logical Thinking','Structuring requirements and code around clear inputs, outputs, conditions, and errors.'],
            ['Database Understanding','Planning relationships and writing queries for dependable application data.'],
            ['Software Principles','Applying maintainability, responsibility, testing, and clear communication to projects.'],
          ].map(([title,text]) => <article className="pro-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>
  )
}

export function ProfessionalExperience() {
  const groups = [
    { title: 'Academic and Study Projects', period: 'Academic development', icon: FiBookOpen, responsibilities: ['Applied programming fundamentals through structured coursework and practical tasks.', 'Designed interfaces and database-backed workflows.', 'Used Git and GitHub to manage source code and project changes.'], skills: ['JavaScript', 'PHP', 'MySQL', 'React', 'Git'] },
    { title: 'Independent Web Projects', period: 'Ongoing practice', icon: FiCode, responsibilities: ['Built browser games, translation and currency interfaces, and a React portfolio.', 'Diagnosed layout, state, API, and browser behavior issues.', 'Created responsive layouts and documented repository setup.'], skills: ['React', 'JavaScript', 'Three.js', 'REST APIs', 'Responsive design'] },
    { title: 'Professional Development', period: 'Continuous learning', icon: FiBriefcase, responsibilities: ['Study modern web engineering, database design, software architecture, and quality practices.', 'Improve code organization, accessibility, testing, documentation, and deployment knowledge.', 'Prepare for contributions to professional and collaborative development work.'], skills: ['Communication', 'Problem solving', 'Testing', 'Documentation'] },
  ]
  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <p className="pro-kicker">Development Journey</p>
        <h1 className="pro-title">Practical <em>Experience</em></h1>
        <p className="pro-lead">This portfolio presents academic, independent, and continuous-development experience honestly. It does not claim formal employment, employers, client engagements, or achievements that have not been verified.</p>
        <div style={{ marginTop: 42, display: 'grid', gap: 16 }}>
          {groups.map((group, index) => (
            <article className="pro-card" key={group.title} style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 18 }}>
              <div className="pro-icon" style={{ margin: 0 }}><group.icon /></div>
              <div>
                <p style={{ color: '#d4af55', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.12em' }}>{group.period}</p>
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, margin: '7px 0 14px' }}>{group.title}</h2>
                <ul>{group.responsibilities.map(item => <li key={item}><FiCheck color="#d4af55" />{item}</li>)}</ul>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 16 }}>{group.skills.map(skill => <span key={skill} style={{ border: '1px solid rgba(212,175,85,.24)', color: '#d4af55', borderRadius: 999, padding: '6px 10px', fontSize: 10 }}>{skill}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
        <div className="pro-hr" />
        <h2 className="pro-section-title">Project-Based Learning Areas</h2>
        <div className="pro-grid">
          {[
            ['Problem Analysis', 'Reviewing a feature request and separating it into interface, logic, data, and validation tasks.'],
            ['Implementation', 'Using existing tools and libraries responsibly, building readable components and code paths.'],
            ['Debugging', 'Using browser tools, logs, API checks, and focused tests to investigate failures.'],
          ].map(([title, text]) => <article className="pro-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
      </div>
    </section>
  )
}

export function ProfessionalSkills() {
  const categories = [
    { title: 'Frontend Development', icon: FiMonitor, skills: [
      ['HTML5', 'Semantic web structure and accessible markup.', 'Landing pages, forms, page structure.', 'Portfolio and web projects'],
      ['CSS3', 'Responsive layouts, visual states, and modern styling.', 'Flexbox, Grid, responsive components, animations.', 'Portfolio and application interfaces'],
      ['JavaScript', 'Application logic, DOM behavior, events, and asynchronous operations.', 'Interactive forms, filtering, API calls.', 'Snake Game, translator, converter'],
      ['React', 'Component-based interfaces, routing, state, and reusable UI patterns.', 'Portfolio pages, dashboards, form workflows.', 'React portfolio and applications'],
      ['Tailwind CSS', 'Utility-first styling for consistent responsive UI.', 'Rapid layout and component styling.', 'React interfaces'],
    ]},
    { title: 'Backend Development', icon: FiDatabase, skills: [
      ['Node.js', 'Server-side JavaScript for application services.', 'API routes and server logic.', 'Full-stack applications'],
      ['Express.js', 'Routing and middleware for Node.js APIs.', 'REST endpoints and request handling.', 'Backend prototypes and APIs'],
      ['PHP', 'Server-side web development and application workflows.', 'Forms, data processing, server pages.', 'PHP projects'],
      ['REST APIs', 'Structured communication between frontend and backend.', 'JSON endpoints and third-party integration.', 'Translator and converter projects'],
    ]},
    { title: 'Database Development', icon: FiDatabase, skills: [
      ['MySQL', 'Relational database storage and structured records.', 'Business data and account workflows.', 'Full-stack database projects'],
      ['Database Relationships', 'Connecting related records with keys and constraints.', 'One-to-many and reference structures.', 'Application data models'],
      ['SQL Queries', 'Reading and changing structured data.', 'Select, insert, update, and delete operations.', 'Database-backed applications'],
      ['CRUD', 'Create, read, update, and delete workflows.', 'Administration and user management.', 'Web applications'],
    ]},
    { title: 'Programming and Tools', icon: FiTool, skills: [
      ['Python', 'General programming and application scripting.', 'Data processing and automation.', 'Programming study'],
      ['Git & GitHub', 'Version control and source sharing.', 'Branches, commits, collaboration.', 'All portfolio repositories'],
      ['VS Code', 'Code editing, debugging, and extensions.', 'React and full-stack development.', 'Daily development'],
      ['Postman', 'Testing and documenting API requests.', 'REST API validation.', 'Backend API work'],
      ['npm', 'JavaScript package and script management.', 'Dependency and build management.', 'React projects'],
    ]},
  ]

  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <p className="pro-kicker">Technical Skills</p>
        <h1 className="pro-title">Skills & <em>Technology</em></h1>
        <p className="pro-lead">This page describes how I use each technology in practical development work. It intentionally does not claim proficiency percentages or expert status without supporting evidence.</p>
        {categories.map(({ title, icon: Icon, skills }, categoryIndex) => (
          <React.Fragment key={title}>
            <div className="pro-hr" />
            <h2 className="pro-section-title">{title}</h2>
            <div className="pro-grid">
              {skills.map(([name, explanation, usage, examples]) => (
                <article className="pro-card" key={name}>
                  <div className="pro-icon"><Icon /></div>
                  <h3>{name}</h3><p>{explanation}</p>
                  <ul>
                    <li><FiCheck color="#d4af55" /><span><strong>Use:</strong> {usage}</span></li>
                    <li><FiCheck color="#d4af55" /><span><strong>Example:</strong> {examples}</span></li>
                  </ul>
                </article>
              ))}
            </div>
          </React.Fragment>
        ))}
        <div className="pro-hr" />
        <h2 className="pro-section-title">Learning Roadmap</h2>
        <div className="pro-grid">
          {[
            ['Strengthen Fundamentals', 'Improve HTML, CSS, JavaScript, Python, SQL, debugging, and software fundamentals.'],
            ['Build Full-Stack Features', 'Practice authentication, API integration, database relationships, validation, and deployment.'],
            ['Improve Engineering', 'Study testing, accessibility, security, architecture, performance, and documentation.'],
          ].map(([title, text]) => <article className="pro-card" key={title}><h3>{title}</h3><p>{text}</p></article>)}
        </div>
        <div className="pro-actions"><Link className="pro-button primary" to="/projects">See Skills in Projects</Link></div>
      </div>
    </section>
  )
}

export function ProfessionalServices() {
  const services = [
    ['Frontend Web Development', 'Responsive and accessible web interfaces using HTML, CSS, JavaScript, and React.', 'UI structure, form behavior, interactions, responsive layouts, and browser testing.', 'A polished interface that works consistently across screen sizes.', ['HTML5', 'CSS3', 'JavaScript', 'React']],
    ['React Application Development', 'Single-page applications with reusable components and clear application state.', 'Routing, reusable components, form validation, API state, and responsive views.', 'Maintainable React screens and predictable user workflows.', ['React', 'JavaScript', 'Tailwind CSS']],
    ['Full Stack Web Development', 'Complete application development from interface to server and database.', 'Requirements, UI, API integration, data storage, testing, and deployment preparation.', 'A connected end-to-end web solution.', ['React', 'Node.js', 'MySQL']],
    ['Backend API Development', 'Server-side endpoints and application services that connect systems and data.', 'Route design, validation, database access, and API documentation.', 'Predictable and structured request and response handling.', ['Node.js', 'Express.js', 'PHP', 'REST']],
    ['PHP Web Development', 'Server-rendered websites and PHP application workflows.', 'Form processing, data storage, CRUD views, and server logic.', 'A practical PHP solution for information or management workflows.', ['PHP', 'MySQL', 'HTML', 'CSS']],
    ['Database Design and Management', 'Structured database models for application records and relationships.', 'Schema planning, SQL queries, constraints, and CRUD operations.', 'Organized and reliable application data.', ['MySQL', 'SQL']],
    ['Responsive Website Development', 'Mobile-first websites that remain readable on phones, tablets, and desktops.', 'Flexible layouts, touch targets, asset optimization, and viewport testing.', 'A consistent experience across devices.', ['HTML', 'CSS', 'JavaScript']],
    ['Website Maintenance', 'Updates, fixes, content changes, and implementation improvements.', 'Issue investigation, code updates, testing, and release preparation.', 'A maintained website with improved stability.', ['Git', 'VS Code', 'npm']],
    ['Technical Support and Consultation', 'Guidance for requirements, project structure, technology choices, and implementation risks.', 'Project review, technical planning, documentation, and practical recommendations.', 'A clearer development plan and next steps.', ['React', 'Node.js', 'MySQL', 'Git']],
  ]
  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <p className="pro-kicker">Professional Services</p>
        <h1 className="pro-title">Development <em>Services</em></h1>
        <p className="pro-lead">I offer practical web development services for responsive interfaces, complete applications, APIs, databases, maintenance, and technical planning. Every request starts by understanding the real goal and required deliverables.</p>
        <div className="pro-grid">
          {services.map(([title, summary, work, benefit, technologies], index) => (
            <article className="pro-card" key={title}>
              <div className="pro-icon">{index < 2 ? <FiCode /> : index < 5 ? <FiDatabase /> : <FiTool />}</div>
              <h3>{title}</h3><p>{summary}</p>
              <ul>
                <li><FiCheck color="#d4af55" /><span><strong>Work:</strong> {work}</span></li>
                <li><FiCheck color="#d4af55" /><span><strong>Benefit:</strong> {benefit}</span></li>
                <li><FiCheck color="#d4af55" /><span><strong>Tools:</strong> {technologies.join(', ')}</span></li>
              </ul>
              <Link className="pro-button" style={{ marginTop: 18, width: '100%' }} to="/contact">Request This Service</Link>
            </article>
          ))}
        </div>
        <div className="pro-hr" />
        <article className="pro-card" style={{ textAlign: 'center' }}>
          <h2 className="pro-section-title">How to Request a Service</h2>
          <p className="pro-section-lead" style={{ margin: '0 auto' }}>Send a short description of the problem, target users, desired features, preferred technologies, timeline, and whether a repository or existing system is available.</p>
          <div className="pro-actions" style={{ justifyContent: 'center' }}><Link className="pro-button primary" to="/contact">Start a Project Discussion</Link></div>
        </article>
      </div>
    </section>
  )
}

export function ProfessionalAbout() {
  const strengths = [
    ['Problem-Solving', 'I break unfamiliar problems into smaller parts, identify the important constraints, and test solutions through practical implementation.'],
    ['Adaptability', 'I am comfortable learning new tools and adjusting an approach when project requirements or feedback changes.'],
    ['Communication', 'I explain technical decisions clearly and keep requirements, progress, risks, and next steps easy to understand.'],
    ['Continuous Learning', 'I improve by building projects, studying documentation, reviewing code, and learning from implementation challenges.'],
  ]
  const interests = ['Web development', 'Frontend engineering', 'Backend engineering', 'Database management', 'Mobile applications', 'Software architecture', 'Emerging technologies']
  const timeline = [
    ['Curiosity', 'My interest in technology began through asking how digital products work and wanting to create useful tools myself.'],
    ['Programming Foundation', 'I developed skills in HTML, CSS, JavaScript, PHP, Python, databases, and software engineering fundamentals.'],
    ['Academic Development', 'My studies in software development strengthened my understanding of application structure, logic, data, and project implementation.'],
    ['Practical Projects', 'I apply my knowledge through portfolio projects involving games, interfaces, APIs, and interactive web experiences.'],
    ['Next Direction', 'I continue building toward reliable full-stack products and opportunities to contribute to real technical teams.'],
  ]

  return (
    <section className="pro-page">
      <style>{styles}</style>
      <div className="pro-container">
        <p className="pro-kicker">Professional Biography</p>
        <h1 className="pro-title">About <em>Me</em></h1>
        <div className="pro-about-profile">
          <img className="pro-about-photo" src={profilePhoto} alt="Muhire Dieudonne" />
          <article>
            <h2 className="pro-section-title">Who I Am</h2>
            <p className="pro-lead">My name is Muhire Dieudonne. I am a Full Stack Developer located in Kigali, Rwanda, with a passion for creating modern, useful, and reliable software solutions. I enjoy turning ideas into structured applications that people can understand, use, and maintain.</p>
            <p className="pro-lead" style={{ marginTop: 18 }}>My development interests cover the complete software lifecycle: user-focused interfaces, server-side logic, database design, debugging, deployment, and continuous improvement.</p>
          </article>
        </div>

        <div className="pro-hr" />
        <article className="pro-card">
          <p className="pro-kicker">Education</p>
          <h2 className="pro-section-title" style={{ marginTop: 12 }}>Bachelor in Technology of Information Technology</h2>
          <p><strong>RP Tumba College</strong><br />Kigali, Rwanda</p>
        </article>
        <div className="pro-actions pro-about-download">
          <a className="pro-button primary" href="/MUHIRE_DIEUDONNE_CV.pdf" download="Muhire_Dieudonne_CV.pdf"><FiDownload />Download My CV</a>
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">My Journey Into Technology</h2>
        <p className="pro-section-lead">I became interested in software development through curiosity about how websites, applications, and digital systems solve everyday problems. That curiosity developed into hands-on learning through programming, academic work, personal projects, and technical experimentation.</p>

        <div className="pro-grid">
          {timeline.map(([title, text]) => (
            <article className="pro-card" key={title}><div className="pro-icon"><FiActivity /></div><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>

        <div className="pro-hr" />
        <div className="pro-grid two">
          <article className="pro-card">
            <h2 className="pro-section-title">Development Philosophy</h2>
            <p>Software should solve an actual problem. It should be understandable to users, dependable in normal and unexpected situations, and structured clearly enough for another developer to maintain.</p>
            <p style={{ marginTop: 12 }}>I prefer practical requirements, straightforward architecture, accessible interfaces, and decisions that remain reasonable as a project grows.</p>
          </article>
          <article className="pro-card">
            <h2 className="pro-section-title">Vision and Goals</h2>
            <p>My goal is to grow as a software engineer while developing digital products that improve access, organization, communication, and productivity in Rwanda and across Africa.</p>
            <p style={{ marginTop: 12 }}>I also value sharing knowledge and contributing to teams where thoughtful engineering can create measurable results.</p>
          </article>
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Technical Interests</h2>
        <div className="pro-grid">
          {interests.map((item, index) => (
            <article className="pro-card" key={item}><p style={{ color: '#d4af55', fontWeight: 800 }}>0{index + 1}</p><h3>{item}</h3></article>
          ))}
        </div>

        <div className="pro-hr" />
        <h2 className="pro-section-title">Strengths and Principles</h2>
        <div className="pro-grid">
          {strengths.map(([title, text]) => (
            <article className="pro-card" key={title}><div className="pro-icon"><FiTarget /></div><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>

        <div className="pro-hr" />
        <article className="pro-card" style={{ textAlign: 'center' }}>
          <h2 className="pro-section-title">Let's Build Something Useful</h2>
          <p className="pro-section-lead" style={{ margin: '0 auto' }}>Discuss a project, internship, development opportunity, or technical collaboration.</p>
          <div className="pro-actions" style={{ justifyContent: 'center' }}><Link className="pro-button primary" to="/contact">Contact Me</Link><Link className="pro-button" to="/projects">View Projects</Link></div>
        </article>
      </div>
    </section>
  )
}
