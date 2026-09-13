export default function Footer() {
  return (
    <>
      <footer>
        <span>{"© 2026 Khem Bahadur Chhetri · Pokhara, Nepal 🇳🇵"}</span>

        <div className={"footer-links"}>
          <a
            href={"https://github.com/khembahadurchhetri"}
            aria-label={"GitHub"}
            target={"_blank"}
            rel={"noopener"}
          >
            <svg
              className={"social-icon"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.7"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              aria-hidden={"true"}
            >
              <path
                fill={"currentColor"}
                stroke={"none"}
                d={
                  "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
                }
              />
            </svg>
            <span>{"GitHub"}</span>
          </a>
          <a href={"mailto:khemchhetri10@gmail.com"} aria-label={"Gmail"}>
            <svg
              className={"social-icon"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.7"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              aria-hidden={"true"}
            >
              <rect x={"3"} y={"5"} width={"18"} height={"14"} rx={"2"} />
              <path d={"m3 6 9 7 9-7M7 10v9m10-9v9"} />
            </svg>
            <span>{"Gmail"}</span>
          </a>
          <a
            href={"https://www.instagram.com/abhimatchhetri/"}
            aria-label={"Instagram"}
            target={"_blank"}
            rel={"noopener"}
          >
            <svg
              className={"social-icon"}
              viewBox={"0 0 24 24"}
              fill={"none"}
              stroke={"currentColor"}
              strokeWidth={"1.7"}
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              aria-hidden={"true"}
            >
              <rect x={"3"} y={"3"} width={"18"} height={"18"} rx={"5"} />
              <circle cx={"12"} cy={"12"} r={"4"} />
              <circle cx={"17.5"} cy={"6.5"} r={".8"} fill={"currentColor"} />
            </svg>
            <span>{"@abhimatchhetri"}</span>
          </a>
        </div>
      </footer>
    </>
  );
}
