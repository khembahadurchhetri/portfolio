export default function Moderation() {
  return (
    <section id="moderation" className="panel">
      <div className="toolbar">
        <h2>Visitor submissions</h2>
        <button type="button" id="refresh-submissions">
          Load approval queue
        </button>
      </div>
      <p>
        Submitted journals stay private until you approve them. Approved entries
        appear in Community with the visitor’s name.
      </p>
      <p id="moderation-status" role="status" />
      <div id="submission-list" />
    </section>
  );
}
