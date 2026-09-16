"use client";
import usePortfolio, { safePortfolioUrl } from "../usePortfolio";
export default function Projects() {
  const { projects } = usePortfolio();
  return (
    <section id="projects">
      <div className="section-wrap">
        <div className="section-header reveal">
          <div><div className="section-kicker">My work</div><h2 className="section-title">Featured<br /><span>projects</span></h2></div>
          <p className="scroll-hint">? swipe / scroll ?</p>
        </div>
        <div className="projects-scroll reveal">
          {projects.map((project) => (
            <article className="project-card" key={project.id}>
              <span className="project-badge full">{project.badge}</span>
              {safePortfolioUrl(project.image) ? (
                <img className={project.imageClass || "project-preview project-preview--screen"} src={safePortfolioUrl(project.image)} alt={project.title} loading="lazy" width="680" height="380" />
              ) : (
                <div className="project-preview studio-preview" aria-hidden="true"><span>{project.title}</span><strong>A little room<br />to create.</strong></div>
              )}
              <div className="project-title">{project.title}</div>
              <p className="project-desc">{project.description}</p>
              <div className="project-stack">{(project.stack || []).map((tag, i) => <span key={i}>{tag}</span>)}</div>
              <div className="project-links">
                {safePortfolioUrl(project.liveUrl) && <a className="live" href={safePortfolioUrl(project.liveUrl)} target="_blank" rel="noopener noreferrer">Live ↗</a>}
                <a className="code" href={safePortfolioUrl(project.codeUrl, "https://github.com/khembahadurchhetri")} target="_blank" rel="noopener noreferrer">{project.codeUrl === "https://github.com/khembahadurchhetri" ? "GitHub ↗" : "Code ↗"}</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
