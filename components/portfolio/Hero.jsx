"use client";
import usePortfolio from "../usePortfolio";
import Image from "next/image";
import TypedName from "./TypedName";
export default function Hero() {
  const { photo } = usePortfolio();
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
          <TypedName />

          <p className={"hero-desc reveal"}>
           
            {
              "I build fast, well-structured web apps end to end — "
            }
            <strong>{"React/Next.js"}</strong>
            {" on the front, "}
            <strong>{"Node.js"}</strong>
            {" & "}
            <strong>{"Python"}</strong>
            {" on the back — with a growing focus on  "}
          
            {"cybersecurity"}
            {". "}
          </p>

          <div className="hero-photo-frame reveal signature-portrait"
            onPointerMove={(event) => {
              if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
              const card = event.currentTarget;
              const bounds = card.getBoundingClientRect();
              const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
              const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
              card.style.setProperty("--portrait-rx", `${(0.5 - y) * 12}deg`);
              card.style.setProperty("--portrait-ry", `${(x - 0.5) * 16}deg`);
              card.style.setProperty("--portrait-light-x", `${x * 100}%`);
              card.style.setProperty("--portrait-light-y", `${y * 100}%`);
            }}
            onPointerLeave={(event) => {
              event.currentTarget.style.setProperty("--portrait-rx", "0deg");
              event.currentTarget.style.setProperty("--portrait-ry", "0deg");
            }}>
            <div className="portrait-shine" aria-hidden="true" />
            <Image
              width={600}
              height={750}
              sizes="(max-width: 768px) 210px, 250px"
              preload
              src={photo}
              unoptimized={true}
              alt={"Khem Bahadur Chhetri"}
              className={"hero-photo"}
            />

            <svg className="portrait-signature" viewBox="0 0 150 65" aria-hidden="true" fill="none">
              <path pathLength="1" d="M22 47 37 10M27 33 56 12M29 30 48 48M58 47 72 13C103 6 96 31 65 32C103 17 100 51 62 48M129 17C108 2 87 46 110 48L131 37M15 58Q78 43 139 53" />
            </svg>
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
