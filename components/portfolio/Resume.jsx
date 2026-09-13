export default function Resume() {
  return (
    <>
      <section id={"resume"}>
        <div className={"section-wrap"}>
          <div className={"section-header reveal"}>
            <div>
              <div className={"section-kicker"}>{"Get the details"}</div>

              <h2 className={"section-title"}>
                {"Resume / "}
                <span>{"CV"}</span>
              </h2>

              <p className={"resume-hint"}>
                {" View my resume online or download the PDF. "}
              </p>
            </div>

            <div className={"resume-actions"}>
              <a
                href={"/assets/Khem_Chhetri_CV.pdf"}
                target={"_blank"}
                rel={"noopener"}
                className={"btn-ghost"}
              >
                {"View Full Screen ↗"}
              </a>

              <a
                href={"/assets/Khem_Chhetri_CV.pdf"}
                download={true}
                className={"btn-solid"}
                id={"resumeCvBtn"}
              >
                {"Download CV ↓"}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
