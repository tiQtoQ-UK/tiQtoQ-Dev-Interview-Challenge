import ChangeInput from "./components/ChangeInput";

export default function Home() {
  return (
    <main className="page-shell page-shell--centered">
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">tiQtoQ Software Developer Interview Challenge</p>
        <h1 id="page-title">Change Risk Analyser</h1>
        <p className="lede">
          Help a software team understand the testing risk associated with a
          proposed change.
        </p>
      </section>
      <ChangeInput />
    </main>
  );
}
