"use client";

import Link from "next/link";
import { useState } from "react";
import type { RiskLevel } from "@dev-interview-challenge/shared/types";

import ChangeInput from "../components/ChangeInput";
import { useAppSelector } from "../store/hooks";

export default function RiskAnalyserPage() {
  const { analysis, description, error, status } = useAppSelector(
    (state) => state.analyseChange,
  );
  const [isInputOpen, setIsInputOpen] = useState(false);

  if (!analysis) {
    return (
      <main className="page-shell page-shell--centered">
        <section
          className="empty-assessment"
          aria-labelledby="assessment-title"
        >
          <p className="eyebrow">Change Risk Analyser</p>
          <h1 id="assessment-title">No Assessment Yet</h1>
          <p className="lede">
            {status === "failed" && error
              ? error
              : "Submit a software change first to generate a risk assessment."}
          </p>
          <Link className="text-link" href="/">
            Back to analyser
          </Link>
        </section>
        <ChangeInput />
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="intro" aria-labelledby="assessment-title">
        <p className="eyebrow">Change Risk Analyser</p>
        <h1 id="assessment-title">Risk Assessment</h1>
        <p className="lede">{description}</p>
      </section>

      <section
        className="collapsible-input"
        aria-labelledby="change-input-title"
      >
        <div className="collapsible-input__header">
          <div>
            <p className="eyebrow">Change Input</p>
            <h2 id="change-input-title">Run another assessment</h2>
          </div>
          <button
            type="button"
            className="secondary-button"
            aria-expanded={isInputOpen}
            aria-controls="change-input-panel"
            onClick={() => setIsInputOpen((current) => !current)}
          >
            {isInputOpen ? "Hide Input" : "Quick Analysis"}
          </button>
        </div>

        {isInputOpen ? (
          <div id="change-input-panel" className="collapsible-input__panel">
            <ChangeInput
              initialDescription={description ?? undefined}
              onAnalysisComplete={() => setIsInputOpen(false)}
              variant="full"
            />
          </div>
        ) : null}
      </section>

      <section className="results results--page" aria-live="polite">
        <div className="results-heading">
          <h2>Assessment</h2>
          <RiskBadge riskLevel={analysis.riskLevel} />
        </div>

        <div className="result-list">
          <ResultSection
            title="Impacted Areas"
            items={analysis.impactedAreas}
          />
          <ResultSection
            title="Recommended Testing"
            items={analysis.recommendedTesting}
            ordered
          />
          <ResultSection title="Why This Rating" items={analysis.rationale} />
        </div>

        <div className="assessment-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => setIsInputOpen(true)}
          >
            Analyse another change
          </button>
        </div>
      </section>
    </main>
  );
}

function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  const className = `risk-badge risk-badge--${riskLevel.toLowerCase()}`;

  return (
    <div className="risk-summary">
      <span className="risk-label">Risk Level</span>
      <span className={className}>{riskLevel}</span>
    </div>
  );
}

function ResultSection({
  title,
  items,
  ordered = false,
}: {
  title: string;
  items: string[];
  ordered?: boolean;
}) {
  const ListTag = ordered ? "ol" : "ul";

  return (
    <section className="result-card">
      <h3>{title}</h3>
      <ListTag>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </section>
  );
}
