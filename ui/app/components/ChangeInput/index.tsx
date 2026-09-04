"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  analyseChange,
  setAnalysisError,
} from "../../store/analyseChangeSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

type ChangeInputProps = {
  initialDescription?: string;
  onAnalysisComplete?: () => void;
  variant?: "centered" | "full";
};

const ChangeInput = ({
  initialDescription,
  onAnalysisComplete,
  variant = "centered",
}: ChangeInputProps) => {
  const router = useRouter();
  const EXAMPLE_DESCRIPTION =
    "Add the ability for administrators to reset another user's MFA configuration.";

  const [description, setDescription] = useState(
    initialDescription ?? EXAMPLE_DESCRIPTION,
  );
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector((state) => state.analyseChange);

  const trimmedDescription = description.trim();
  const isSubmitting = status === "loading";
  const canSubmit = trimmedDescription.length > 0 && !isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!trimmedDescription) {
      dispatch(
        setAnalysisError("Enter a change description before analysing risk."),
      );
      return;
    }

    try {
      await dispatch(analyseChange({ description: trimmedDescription })).unwrap();
      onAnalysisComplete?.();
      router.push("/risk-analyser");
    } catch {
      // The slice already stores the API error for the form to display.
    }
  }

  return (
    <section
      className={`workspace workspace--single workspace--${variant}`}
      aria-label="Change risk analysis workspace"
    >
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
          Include the user flow, system area, and anything security, data, or
          integration related.
        </p>
        <div className="form-actions">
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Analysing..." : "Analyse risk"}
          </button>
          <span className="character-count">{description.length}/2000</span>
        </div>
        {error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  );
};

export default ChangeInput;
