export default function Experience() {
  return (
    <>
      <section id={"experience"}>
        <div className={"section-wrap"}>
          <div className={"section-header reveal"}>
            <div>
              <div className={"section-kicker"}>{"Where I've worked"}</div>

              <h2 className={"section-title"}>
                {"Work"}
                <br />
                <span>{"experience"}</span>
              </h2>
            </div>
          </div>

          <div className={"reveal"}>
            <div className={"exp-row"}>
              <div className={"exp-period"}>{"2025"}</div>

              <div>
                <div className={"exp-role"}>{"Frontend Developer Intern"}</div>

                <div className={"exp-org"}>
                  {" Easy Innovation, Srijana Chowk, Pokhara · 2 months "}
                </div>

                <div className={"exp-desc"}>
                  {
                    " Developed and maintained React/Next.js features for a real estate platform. Built reusable UI components with TypeScript and Tailwind CSS, integrated REST APIs, fixed UI/UX issues, and collaborated through Git/GitHub code reviews. "
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
