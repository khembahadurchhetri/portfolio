import Moderation from "./Moderation";
export default function Studio() {
  return (
    <>
      <header>
        <a href={"/"}>{"← Portfolio"}</a>
        <strong>{"Portfolio Studio"}</strong>
        <button id={"logout"} hidden={true}>
          {"Sign out"}
        </button>
      </header>

      <main>
        <p className={"eyebrow"}>{"Your stories, your space"}</p>
        <h1>{"A little room to create."}</h1>
        <p className={"intro"}>
          {"Manage your projects, profile photo, CV and journal."}
        </p>
        <p id={"status"} role={"status"} aria-live={"polite"} />

        <section id={"login-panel"} className={"panel"}>
          <h2>{"Owner sign in"}</h2>
          <p>{"Your portfolio editing and journal publishing tools live here."}</p>
          <form id={"login"}>
            <label>
              {"Email"}
              <input
                name={"email"}
                type={"email"}
                autoComplete={"username"}
                required={true}
              />
            </label>
            <label>
              {"Password"}
              <input
                name={"password"}
                type={"password"}
                autoComplete={"current-password"}
                required={true}
              />
            </label>
            <button className={"primary"}>{"Sign in"}</button>
          </form>
        </section>

        <section id={"workspace"} hidden={true}>
          <section className="panel" id="portfolio-panel">
            <h2>Portfolio settings</h2>
            <p>Edit your projects, profile photo and CV. Only your owner account can save changes. Saved content and uploaded portfolio files are public.</p>
            <p id="portfolio-status" role="status" aria-live="polite" />
            <div id="portfolio-editor" />
          </section>
          <Moderation />
          <div className={"toolbar"}>
            <h2>{"Your entries"}</h2>
            <button id={"new"} className={"primary"}>
              {"+ New entry"}
            </button>
          </div>
          <div className={"studio-layout"}>
            <aside className={"panel"}>
              <label>
                {"Category"}
                <select id={"category-filter"}>
                  <option value={" "}>{"All categories"}</option>
                </select>
              </label>
              <label>
                {"Visibility"}
                <select id={"visibility-filter"}>
                  <option value={"all"}>{"All entries"}</option>
                  <option>{"public"}</option>
                  <option>{"private"}</option>
                  <option>{"draft"}</option>
                </select>
              </label>
              <div id={"entries"} />
            </aside>

            <section className={"panel"}>
              <h2 id={"editor-heading"}>{"New entry"}</h2>
              <form id={"editor"}>
                <input name={"id"} type={"hidden"} />
                <label>
                  {"Title"}
                  <input name={"title"} maxLength={"140"} required={true} />
                </label>
                <div className={"fields"}>
                  <label>
                    {"Category"}
                    <input
                      name={"category"}
                      list={"categories"}
                      maxLength={"60"}
                      required={true}
                    />
                    <datalist id={"categories"}>
                      <option>{"Notes"}</option>
                      <option>{"Photos & videos"}</option>
                      <option>{"Vlogs"}</option>
                      <option>{"Books"}</option>
                      <option>{"Quotes"}</option>
                      <option>{"News"}</option>
                      <option>{"Movies"}</option>
                    </datalist>
                  </label>
                  <label>
                    {"Visibility"}
                    <select name={"visibility"}>
                      <option value={"draft"}>{"Draft · only you"}</option>
                      <option value={"private"}>{"Private · only you"}</option>
                      <option value={"public"}>{"Public · everyone"}</option>
                    </select>
                  </label>
                </div>
                <label>
                  {"Your story"}
                  <textarea name={"text"} rows={"9"} maxLength={"20000"} />
                </label>
                <label>
                  {"Related link (optional)"}
                  <input name={"url"} type={"url"} placeholder={"https://"} />
                </label>
                <label>
                  {"Photo or video (up to 20 MB)"}
                  <input
                    id={"upload"}
                    type={"file"}
                    accept={
                      "image/png,image/jpeg,image/webp,video/mp4,video/webm"
                    }
                  />
                </label>
                <input name={"image"} type={"hidden"} />
                <div id={"media-preview"} />
                <button type={"button"} id={"remove-media"}>
                  {"Remove attachment"}
                </button>
                <label className={"check"}>
                  <input name={"sample"} type={"checkbox"} />
                  {"Label as sample content"}
                </label>
                <p id={"editor-status"} role={"status"} aria-live={"polite"}>
                  {"Changes are saved when you click Save entry."}
                </p>
                <div className={"actions"}>
                  <button className={"primary"} id={"save"}>
                    {"Save entry"}
                  </button>
                  <button
                    type={"button"}
                    id={"delete"}
                    className={"danger"}
                    hidden={true}
                  >
                    {"Delete entry"}
                  </button>
                </div>
                <p className={"hint"}>
                  {
                    "Draft means an unfinished entry saved for later. Private means an entry you want to keep to yourself. Both are visible only to you after signing in. These settings apply to journal entries and their attachments, not your portfolio profile photo, CV or project images. Changing an entry to public also publishes its attachment. Previously public content may already have been downloaded by visitors."
                  }
                </p>
              </form>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
