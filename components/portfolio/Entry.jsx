export default function Entry() {
  return (
    <>
      <header>
        <a href={"/#journal"}>{"← Back to journal"}</a>
        <strong>{"Personal journal"}</strong>
        <a href={"/admin"}>{"Owner sign in"}</a>
      </header>
      <main>
        <article id={"entry"} className={"panel"}>
          <p role={"status"}>{"Loading entry…"}</p>
        </article>
      </main>
    </>
  );
}
