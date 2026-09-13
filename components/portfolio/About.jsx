export default function About() {
  return (
    <>
      <section id={"about"}>
        <div className={"section-wrap"}>
          <div className={"about-grid"}>
            <div className={"about-text reveal"}>
              <div className={"section-kicker"}>{"About me"}</div>

              <h2 className={"section-title"}>
                {" A little about"}
                <br />
                <span>{"my work."}</span>
              </h2>

              <p>
                {" I'm "}
                <strong>{"Khem Bahadur Chhetri"}</strong>
                {", a Computer Engineer and developer based in "}
                <strong>{"Pokhara, Nepal"}</strong>
                {
                  ". I build web apps end to end — the kind that people actually enjoy using. "
                }
              </p>

              <p>
                {
                  " My work spans web development, AI/ML experiments, and cybersecurity fundamentals. I care about clean, well-structured code and closing the gap between a working prototype and something production-ready. "
                }
              </p>

              <div className={"about-tags"}>
                <span className={"about-tag"}>{"Full Stack"}</span>

                <span className={"about-tag"}>{"AI / ML"}</span>

                <span className={"about-tag"}>{"Cybersecurity"}</span>

                <span className={"about-tag"}>{"Cloud (learning)"}</span>
              </div>
            </div>

            <div className={"about-right reveal"}>
              <div className={"section-kicker"}>{"Quick facts"}</div>

              <div className={"facts-scroll"}>
                <div className={"fact-card"}>
                  <div className={"fact-label"}>{"Based in"}</div>

                  <div className={"fact-value"}>{"Pokhara, Nepal"}</div>
                </div>

                <div className={"fact-card"}>
                  <div className={"fact-label"}>{"Education"}</div>

                  <div className={"fact-value"}>
                    {"B.E. Computer Engineering"}
                  </div>
                </div>

                <div className={"fact-card"}>
                  <div className={"fact-label"}>{"Currently"}</div>

                  <div className={"fact-value"}>
                    {" Learning cloud & deepening cybersecurity "}
                  </div>
                </div>

                <div className={"fact-card"}>
                  <div className={"fact-label"}>{"Stack of choice"}</div>

                  <div className={"fact-value"}>{"Next.js + Python"}</div>
                </div>

                <div className={"fact-card"}>
                  <div className={"fact-label"}>{"Off duty"}</div>

                  <div className={"fact-value"}>
                    {"Trail hikes around Pokhara"}
                  </div>
                </div>
              </div>

              <p className={"scroll-hint"}>{"← swipe / scroll →"}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
