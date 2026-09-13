import Image from "next/image";
export default function Hero() {
  return (
    <>
      <section id={"hero"}>
        <div className={"landscape"} aria-hidden={"true"}>
          <div className={"landscape-layer landscape-sky"} data-depth={"0.14"}>
            <svg
              className={"moon-disc"}
              viewBox={"0 0 80 80"}
              focusable={"false"}
            >
              <path
                className={"moon"}
                d={"M52 8A30 30 0 1 0 68 57A30 30 0 0 1 52 8Z"}
              />
            </svg>

            <svg
              viewBox={"0 0 1440 800"}
              preserveAspectRatio={"xMidYMid slice"}
              focusable={"false"}
            >
              <g className={"day-sky"}>
                <circle
                  className={"sun-ring"}
                  cx={"1190"}
                  cy={"160"}
                  r={"66"}
                />

                <circle className={"sun"} cx={"1190"} cy={"160"} r={"48"} />

                <g className={"sky-drift cloud"}>
                  <path
                    d={
                      "M870 120h100m-75-12h115M1250 320h110m-80-12h45M80 230h75"
                    }
                  />
                </g>
              </g>

              <g className={"night-sky"}>
                <g className={"stars"}>
                  <circle cx={"990"} cy={"88"} r={"2"} />
                  <circle cx={"1330"} cy={"290"} r={"2"} />
                  <circle cx={"850"} cy={"170"} r={"1.6"} />
                  <circle cx={"1100"} cy={"260"} r={"2"} />
                  <circle cx={"250"} cy={"95"} r={"1.6"} />
                </g>

                <g className={"stars delayed"}>
                  <path d={"m1320 110 2-6 2 6 6 2-6 2-2 6-2-6-6-2Z"} />
                  <circle cx={"740"} cy={"110"} r={"2"} />
                  <circle cx={"1020"} cy={"330"} r={"1.5"} />
                  <circle cx={"80"} cy={"310"} r={"1.8"} />
                </g>
              </g>
            </svg>
          </div>

          <div className={"landscape-layer landscape-far"} data-depth={"0.30"}>
            <svg
              viewBox={"0 0 1440 400"}
              preserveAspectRatio={"none"}
              focusable={"false"}
            >
              <path
                className={"mountain-fill"}
                d={
                  "M0 250 180 130 290 200 505 65 670 215 820 125 965 210 1170 40 1440 210V400H0Z"
                }
              />

              <path
                className={"mountain-line"}
                d={
                  "m0 250 180-120 110 70L505 65l165 150 150-90 145 85 205-170 270 170M430 112l75-47 58 53-49-13-20 20-18-15Z"
                }
              />
            </svg>
          </div>

          <div className={"landscape-layer landscape-near"} data-depth={"0.48"}>
            <svg
              viewBox={"0 0 1440 320"}
              preserveAspectRatio={"none"}
              focusable={"false"}
            >
              <path
                className={"hill-fill"}
                d={"M0 135Q170 45 350 170T740 150T1120 115T1440 120V320H0Z"}
              />

              <g className={"tree-fill"}>
                <path
                  d={
                    "m45 40-24 48h15l-25 43h25l-24 40h66l-23-40h23L55 88h14ZM1310 20l-30 56h18l-32 54h30l-28 46h84l-30-46h26l-30-54h18ZM1380 68l-23 43h14l-26 44h24l-21 35h64l-22-35h23l-25-44h15Z"
                  }
                />
              </g>

              <g className={"tree-line"}>
                <path d={"M45 97v115m1265-121v121m70-86v85"} />
              </g>
            </svg>
          </div>
        </div>

        <div className={"hero-inner"}>
          <div className={"hero-eyebrow reveal"}>
            {" Building from Pokhara "}
          </div>

          <h1 className={"hero-name reveal"}>
            {"Khem Bahadur"}
            <br />
            <span>{"Chhetri"}</span>
          </h1>

          <p className={"hero-desc reveal"}>
            <strong>{"Full Stack Developer"}</strong>
            {
              " & Computer Engineer. I build fast, well-structured web apps end to end — "
            }
            <strong>{"React/Next.js"}</strong>
            {" on the front, "}
            <strong>{"Node.js"}</strong>
            {" & "}
            <strong>{"Python"}</strong>
            {" on the back — with a growing focus on "}
            <strong>{"cloud"}</strong>
            {" and "}
            <strong>{"cybersecurity"}</strong>
            {". "}
          </p>

          <div className={"hero-photo-frame reveal"}>
            <Image
              width={600}
              height={750}
              sizes="(max-width: 768px) 210px, 250px"
              preload
              src={"/assets/khem-photo.jpg"}
              alt={"Khem Bahadur Chhetri"}
              className={"hero-photo"}
            />

            <span className={"hero-photo-tag"}>
              {"Pokhara, Nepal · 28°14'N"}
            </span>
          </div>

          <div className={"hero-actions reveal"}>
            <a href={"#projects"} className={"btn-solid"}>
              {"Explore my projects"}
            </a>

            <a href={"#resume"} className={"btn-ghost"}>
              {"View Resume →"}
            </a>
          </div>

          <div className={"hero-meta reveal"}>
            <span>{"3+ mo. internship"}</span>
            <span className={"dot"}>{"·"}</span>

            <span>{"Pokhara University"}</span>
            <span className={"dot"}>{"·"}</span>

            <span>{"React · Next.js · Python"}</span>
          </div>
        </div>
      </section>
    </>
  );
}
