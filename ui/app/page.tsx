const emptyStates = [
  ["Risk level", "Your assessment will appear here."],
  ["Potentially impacted areas", "Identify the systems, concerns, or user journeys affected by the change."],
  ["Recommended testing", "Present the tests the team should prioritise before releasing the change."]
] as const;

export default function Home() {
  return (
    <main className="page-shell">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">Software Developer Interview Challenge</p>
        <h1 id="page-title">Change Risk Analyser</h1>
        <p className="lede">
          Help a software team understand the testing risk associated with a proposed change.
        </p>
      </section>

      <section className="workspace" aria-label="Change analysis workspace">
        <form className="change-form">
          <label htmlFor="change-description">Describe the proposed software change</label>
          <textarea
            id="change-description"
            name="change-description"
            rows={7}
            placeholder="For example: Allow administrators to reset another user’s MFA configuration."
          />
          <p className="field-hint">Be specific about the user, action, and affected behaviour.</p>
          <button type="button" disabled aria-describedby="integration-note">
            Analyse change
          </button>
          <p id="integration-note" className="integration-note">
            This action is intentionally unimplemented. Connect it to your standalone API and render its response below.
          </p>
        </form>

        <section className="results" aria-labelledby="results-title">
          <div className="results-heading">
            <p className="eyebrow">Analysis</p>
            <h2 id="results-title">Assessment</h2>
          </div>
          <div className="result-list">
            {emptyStates.map(([title, description]) => (
              <article className="result-card" key={title}>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
