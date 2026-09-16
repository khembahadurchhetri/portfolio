export default function Navigation() {
  return (
    <>
      <div id={"trail-rail"}>
        <div className={"rail-track"}>
          <div className={"rail-fill"} id={"railFill"} />
        </div>

      <button
        className="rail-music-btn"
        id="railMusicBtn"
        type="button"
        aria-label="Play background music"
        aria-pressed="false"
        aria-controls="bgAudio"
      >
        {"\u25b6"}
      </button>
      </div>

      <audio
        id={"bgAudio"}
        loop={true}
        preload={"none"}
        src={"/assets/home-was-you.mp3"}
      />

      <nav>
        <a href={"#hero"} className={"nav-logo"}>
          <span className={"bracket"}>{"<"}</span>
          {"Abhimat"}
          <span className={"bracket"}>{"/>"}</span>
        </a>

        <ul className={"nav-links"}>
          <li>
            <a href={"#about"}>{"About"}</a>
          </li>

          <li>
            <a href={"#skills"}>{"Skills"}</a>
          </li>

          <li>
            <a href={"#experience"}>{"Experience"}</a>
          </li>

          <li>
            <a href={"#projects"}>{"Projects"}</a>
          </li>

          <li>
            <a href={"#journal"}>{"Journal"}</a>
          </li>

          <li>
            <a href={"#resume"}>{"Resume"}</a>
          </li>

          <li>
            <a href={"#contact"}>{"Contact"}</a>
          </li>
        </ul>

        <div className={"nav-actions"}>
          <button
            id={"theme-toggle"}
            type={"button"}
            aria-label={"Switch to light mode"}
            title={"Switch to light mode"}
          >
            <span id={"themeKnob"} aria-hidden={"true"}>
              {"☀"}
            </span>
          </button>

          <button className={"hamburger"} id={"hamburger"} aria-label={"Menu"}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={"mobile-menu"} id={"mobileMenu"}>
        <a href={"#about"}>{"About"}</a>

        <a href={"#skills"}>{"Skills"}</a>

        <a href={"#experience"}>{"Experience"}</a>

        <a href={"#projects"}>{"Projects"}</a>

        <a href={"#journal"}>{"Journal"}</a>

        <a href={"#resume"}>{"Resume"}</a>

        <a href={"#contact"}>{"Contact"}</a>

        <p className={"menu-sub"}>{"© 2023 Khem Bahadur Chhetri"}</p>
      </div>
    </>
  );
}
