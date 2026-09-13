export default function Skills() {
  return (
    <>
      <section id={"skills"}>
        <div className={"section-wrap"}>
          <div className={"section-header reveal"}>
            <div>
              <div className={"section-kicker"}>{"What I work with"}</div>

              <h2 className={"section-title"}>
                {" Skills &"}
                <br />
                <span>{"technologies"}</span>
              </h2>
            </div>
          </div>

          <div className={"skills-grid reveal"}>
            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"⚛️"}</span>

                <span className={"skill-item-name"}>{"Frontend"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip"}>{"React"}</span>
                <span className={"chip"}>{"Next.js"}</span>

                <span className={"chip"}>{"TypeScript"}</span>
                <span className={"chip"}>{"Tailwind"}</span>

                <span className={"chip"}>{"HTML / CSS"}</span>
              </div>
            </div>

            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"🖥️"}</span>

                <span className={"skill-item-name"}>{"Backend"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip"}>{"Node.js"}</span>
                <span className={"chip"}>{"Express"}</span>

                <span className={"chip"}>{"Django"}</span>
                <span className={"chip"}>{"Python"}</span>
              </div>
            </div>

            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"🗄️"}</span>

                <span className={"skill-item-name"}>{"Database & Cloud"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip"}>{"MongoDB"}</span>
                <span className={"chip"}>{"PostgreSQL"}</span>

                <span className={"chip"}>{"MySQL"}</span>
                <span className={"chip"}>{"AWS"}</span>
              </div>
            </div>

            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"🤖"}</span>

                <span className={"skill-item-name"}>{"AI / ML"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip cyber"}>{"TensorFlow"}</span>
                <span className={"chip cyber"}>{"Keras"}</span>

                <span className={"chip cyber"}>{"CNN"}</span>
                <span className={"chip cyber"}>{"OpenCV"}</span>
              </div>
            </div>

            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"🔐"}</span>

                <span className={"skill-item-name"}>{"Cybersecurity"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip accent"}>{"Pen Testing"}</span>
                <span className={"chip accent"}>{"OWASP"}</span>

                <span className={"chip accent"}>{"Wireshark"}</span>
                <span className={"chip accent"}>{"Kali Linux"}</span>
              </div>
            </div>

            <div className={"skill-item"}>
              <div className={"skill-item-head"}>
                <span className={"skill-item-icon"}>{"🔧"}</span>

                <span className={"skill-item-name"}>{"Dev Tools"}</span>
              </div>

              <div className={"skill-chips"}>
                <span className={"chip"}>{"Git"}</span>
                <span className={"chip"}>{"Docker"}</span>

                <span className={"chip"}>{"Linux"}</span>
                <span className={"chip"}>{"CI/CD"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
