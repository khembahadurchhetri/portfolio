"use client";
import usePortfolio from "../usePortfolio";
export default function Ticker() {
  const { cv } = usePortfolio();
  return (
    <>
      <div className={"ticker-block"}>
        <div className={"ticker-row"} data-dir={"left"}>
          <div className={"ticker-track"}>
            <div className={"ticker-group"}>
              <span>{"Next.js"}</span>
              <span>{"React"}</span>
              <span>{"TypeScript"}</span>
              <span>{"Python"}</span>
              <span>{"Node.js"}</span>
              <span>{"Django"}</span>
              <span>{"Docker"}</span>
              <span>{"Linux"}</span>
              <span>{"AWS"}</span>
              <span>{"MongoDB"}</span>
              <span>{"PostgreSQL"}</span>
              <span>{"TensorFlow"}</span>
              <span>{"OWASP"}</span>
              <span>{"Kali Linux"}</span>
              <span>{"Git"}</span>
            </div>
            <div className={"ticker-group"} aria-hidden={"true"}>
              <span>{"Next.js"}</span>
              <span>{"React"}</span>
              <span>{"TypeScript"}</span>
              <span>{"Python"}</span>
              <span>{"Node.js"}</span>
              <span>{"Django"}</span>
              <span>{"Docker"}</span>
              <span>{"Linux"}</span>
              <span>{"AWS"}</span>
              <span>{"MongoDB"}</span>
              <span>{"PostgreSQL"}</span>
              <span>{"TensorFlow"}</span>
              <span>{"OWASP"}</span>
              <span>{"Kali Linux"}</span>
              <span>{"Git"}</span>
            </div>
          </div>
        </div>

        <div className={"ticker-row"} data-dir={"right"}>
          <div className={"ticker-track"}>
            <div className={"ticker-group"}>
              <a
                href={"https://github.com/khembahadurchhetri"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"GitHub ↗"}
              </a>
              <a
                href={"https://www.linkedin.com/in/khemchhetri"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"LinkedIn ↗"}
              </a>
              <a href={"mailto:khemchhetri10@gmail.com"}>{"Email ↗"}</a>
              <a href={cv} download={true}>
                {"Resume ↗"}
              </a>
              <a
                href={"https://hamrobot.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"HamroChatbot ↗"}
              </a>
              <a
                href={"https://threftnepal.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"Theftshop ↗"}
              </a>
              <a
                href={"https://stockvolatilitydetector.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"AI Stock ↗"}
              </a>
              <a
                href={"https://www.instagram.com/abhimatchhetri/"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"Instagram ↗"}
              </a>
            </div>
            <div className={"ticker-group"} aria-hidden={"true"}>
              <a
                tabIndex={"-1"}
                href={"https://github.com/khembahadurchhetri"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"GitHub ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={"https://www.linkedin.com/in/khemchhetri"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"LinkedIn ↗"}
              </a>
              <a tabIndex={"-1"} href={"mailto:khemchhetri10@gmail.com"}>
                {"Email ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={cv}
                download={true}
              >
                {"Resume ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={"https://hamrobot.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"HamroChatbot ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={"https://threftnepal.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"Theftshop ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={"https://stockvolatilitydetector.vercel.app"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"AI Stock ↗"}
              </a>
              <a
                tabIndex={"-1"}
                href={"https://www.instagram.com/abhimatchhetri/"}
                target={"_blank"}
                rel={"noopener"}
              >
                {"Instagram ↗"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
