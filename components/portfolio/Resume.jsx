"use client";
import usePortfolio from "../usePortfolio";
export default function Resume() {
  const { cv } = usePortfolio();
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
                href={cv}
                target={"_blank"}
                rel={"noopener"}
                className={"btn-ghost"}
              >
                {"View Full Screen ↗"}
              </a>

              <a
                href={cv}
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
