"use client";

import { FormEvent, useState } from "react";
import type { ChangeRiskAnalysis, RiskLevel } from "@dev-interview-challenge/shared/types";

import { analyseChange, setAnalysisError } from "./store/analyseChangeSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";

const EXAMPLE_DESCRIPTION = "Add the ability for administrators to reset another user's MFA configuration.";

export function ChangeRiskAnalyser() {
  const [description, setDescription] = useState(EXAMPLE_DESCRIPTION);
  const dispatch = useAppDispatch();
  const { analysis, error, status } = useAppSelector((state) => state.analyseChange);

  const trimmedDescription = description.trim();
  const isSubmitting = status === "loading";
  const canSubmit = trimmedDescription.length > 0 && !isSubmitting;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedDescription) {
      dispatch(setAnalysisError("Enter a change description before analysing risk."));
      return;
    }

    void dispatch(analyseChange({ description: trimmedDescription }));
  }

  return (
    <section className="workspace" aria-label="Change risk analysis workspace">
      <form className="change-form" onSubmit={handleSubmit}>
        <label htmlFor="change-description">Proposed software change</label>
        <textarea
          id="change-description"
          minLength={1}
          maxLength={2000}
          rows={8}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the change the team is considering..."
        />
        <p className="field-hint">
          Include the user flow, system area, and anything security, data, or integration related.
        </p>
        <div className="form-actions">
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Analysing..." : "Analyse risk"}
          </button>
          <span className="character-count">{description.length}/2000</span>
        </div>
        {error ? <p className="error-message" role="alert">{error}</p> : null}
      </form>

      <AnalysisResults analysis={analysis} isSubmitting={isSubmitting} />
    </section>
  );
}

function AnalysisResults({ analysis, isSubmitting }: { analysis: ChangeRiskAnalysis | null; isSubmitting: boolean }) {
  if (isSubmitting) {
    return (
      <aside className="results" aria-live="polite">
        <div className="results-heading">
          <h2>Assessment</h2>
          <p>Analysing the change description...</p>
        </div>
        <EmptyResultCards />
      </aside>
    );
  }

  if (!analysis) {
    return (
      <aside className="results">
        <div className="results-heading">
          <h2>Assessment</h2>
          <p>Submit a change description to generate a testing risk assessment.</p>
        </div>
        <EmptyResultCards />
      </aside>
    );
  }

  return (
    <aside className="results" aria-live="polite">
      <div className="results-heading">
        <h2>Assessment</h2>
        <RiskBadge riskLevel={analysis.riskLevel} />
      </div>

      <div className="result-list">
        <ResultSection title="Impacted Areas" items={analysis.impactedAreas} />
        <ResultSection title="Recommended Testing" items={analysis.recommendedTesting} ordered />
        <ResultSection title="Why This Rating" items={analysis.rationale} />
      </div>
    </aside>
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

function ResultSection({ title, items, ordered = false }: { title: string; items: string[]; ordered?: boolean }) {
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

function EmptyResultCards() {
  return (
    <div className="result-list" aria-hidden="true">
      <div className="result-card">
        <h3>Risk Level</h3>
        <p>Low, Medium, or High</p>
      </div>
      <div className="result-card">
        <h3>Impacted Areas</h3>
        <p>Areas potentially affected by the proposed change.</p>
      </div>
      <div className="result-card">
        <h3>Recommended Testing</h3>
        <p>Practical checks for the development team.</p>
      </div>
    </div>
  );
}
