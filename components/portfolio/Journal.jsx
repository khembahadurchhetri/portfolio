export default function Journal() {
  return (
    <>
      <section id={"journal"}>
        <div className={"section-wrap"}>
          <div className={"section-header reveal"}>
            <div>
              <div className={"section-kicker"}>{"Away from the keyboard"}</div>
              <h2 className={"section-title"}>
                {"The "}
                <span>{"Journal"}</span>
              </h2>
            </div>
            <p className={"journal-intro"}>
              {"Places I go. Things I read."}
              <br />
              {"Little moments worth keeping."}
            </p>
          </div>

          <div className={"journal-window"}>
            <div className={"journal-window-bar"}>
              <strong>{"My personal journal"}</strong>
              <span id={"journal-mode"}>{"Little moments"}</span>
            </div>

            <div
              className={"journal-filters"}
              role={"group"}
              aria-label={"Filter journal"}
            />

            <div
              className={"journal-grid"}
              tabIndex={"0"}
              role={"region"}
              aria-label={"Personal journal entries"}
              aria-live={"polite"}
            />
          </div>

          <div className={"journal-private"}>
            <span>{"My private corner"}</span>
            <a href={"/admin"}>{"Owner sign in ↗"}</a>
          </div>

          <noscript>{"Enable JavaScript to browse the journal."}</noscript>
        </div>
      </section>
    </>
  );
}
