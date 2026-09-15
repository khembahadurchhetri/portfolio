const skills = [
  { name: "Frontend", level: 3, tools: ["React", "Next.js", "TypeScript", "Tailwind", "HTML / CSS"] },
  { name: "Backend", level: 2, tools: ["Node.js", "Express", "Django", "Python"] },
  { name: "Database & cloud", level: 3, tools: ["PostgreSQL", "MongoDB", "MySQL", "AWS", "Render"] },
  { name: "AI / ML", level: 3, tools: ["NumPy", "pandas", "TensorFlow", "Keras", "CNN", "OpenCV"] },
  { name: "Dev tools", level: 4, tools: ["Git", "Docker", "Linux", "CI/CD"] },
];

export default function Skills() {
  return (
    <section id="skills">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div>
            <div className="section-kicker">What I work with</div>
            <h2 className="section-title">My <span>toolkit</span></h2>
          </div>
        </div>
        <div className="toolkit-grid reveal">
          {skills.map((skill, index) => (
            <article className="toolkit-item" key={skill.name}>
              <div className="toolkit-heading">
                <span className="toolkit-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{skill.name}</h3>
                <span className="toolkit-rating" role="img" aria-label={`${skill.name}: ${skill.level} out of 5`} title={`${skill.level} / 5`}>
                  {Array.from({ length: 5 }, (_, light) => <i key={light} className={light < skill.level ? "toolkit-light is-lit" : "toolkit-light"} />)}
                </span>
              </div>
              <ul className="toolkit-tools">{skill.tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
