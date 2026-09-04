import type { ChangeRiskAnalysis, RiskLevel, RiskSignal } from "../types/index.js";

export type {
  ApiErrorResponse,
  ChangeRiskAnalysis,
  ChangeRiskRequest,
  ChangeRiskResponse,
  RiskLevel,
  RiskSignal
} from "../types/index.js";

const SIGNALS: RiskSignal[] = [
  {
    label: "authentication or identity flows",
    weight: 4,
    areas: ["Authentication", "Session management", "Security"],
    testingActivities: [
      "Verify successful and failed authentication paths still behave correctly.",
      "Test expired, revoked, and concurrent sessions around the changed flow.",
      "Run regression tests for account lockout, password, and MFA scenarios."
    ]
  },
  {
    label: "authorisation or role changes",
    weight: 4,
    areas: ["User permissions", "Access control", "Security"],
    testingActivities: [
      "Verify only authorised roles can perform the new or changed action.",
      "Test direct API calls with insufficient permissions.",
      "Check privilege boundaries for administrators and standard users."
    ]
  },
  {
    label: "payment or billing behaviour",
    weight: 4,
    areas: ["Billing", "Payments", "External integrations"],
    testingActivities: [
      "Test successful, failed, and retried payment flows.",
      "Verify invoices, receipts, refunds, and reconciliation records.",
      "Use sandbox provider tests for webhook ordering and duplicate events."
    ]
  },
  {
    label: "data deletion, migration, or persistence",
    weight: 4,
    areas: ["Data storage", "Data integrity", "Backups"],
    testingActivities: [
      "Verify data is created, updated, deleted, and restored as expected.",
      "Test migration rollback and compatibility with existing records.",
      "Check validation and error handling for malformed or missing data."
    ]
  },
  {
    label: "public API or contract changes",
    weight: 3,
    areas: ["API contracts", "Integrations", "Backward compatibility"],
    testingActivities: [
      "Add contract tests for request and response shape changes.",
      "Verify existing clients remain compatible or receive clear errors.",
      "Test rate limits, validation failures, and idempotency where relevant."
    ]
  },
  {
    label: "audit, logging, or compliance concerns",
    weight: 3,
    areas: ["Audit logging", "Compliance", "Observability"],
    testingActivities: [
      "Verify sensitive actions are recorded with actor, target, and timestamp.",
      "Check logs do not expose secrets or personal data.",
      "Confirm monitoring and alerting cover important failure modes."
    ]
  },
  {
    label: "user interface changes",
    weight: 2,
    areas: ["User interface", "Accessibility", "Browser compatibility"],
    testingActivities: [
      "Test the main workflow across desktop and mobile viewports.",
      "Check keyboard navigation, focus order, and screen reader labels.",
      "Verify empty, loading, success, and error states."
    ]
  },
  {
    label: "notifications or messaging",
    weight: 2,
    areas: ["Notifications", "Email delivery", "User communication"],
    testingActivities: [
      "Verify messages are sent to the correct recipients.",
      "Test opt-out, bounce, retry, and duplicate-send scenarios.",
      "Check message content for sensitive data leakage."
    ]
  },
  {
    label: "configuration or feature flags",
    weight: 2,
    areas: ["Configuration", "Release controls", "Operations"],
    testingActivities: [
      "Test enabled, disabled, and missing configuration states.",
      "Verify feature flag rollout and rollback behaviour.",
      "Check defaults are safe in each deployment environment."
    ]
  }
];

const SIGNAL_PATTERNS: Array<{ signal: RiskSignal; patterns: RegExp[] }> = [
  {
    signal: SIGNALS[0],
    patterns: [/\bauth(?:entication)?\b/i, /\blogin\b/i, /\bsign[- ]?in\b/i, /\bpassword\b/i, /\bmfa\b/i, /\b2fa\b/i, /\bsession\b/i]
  },
  {
    signal: SIGNALS[1],
    patterns: [/\badmin(?:istrator)?s?\b/i, /\brole?s?\b/i, /\bpermission?s?\b/i, /\bauthori[sz]ation\b/i, /\baccess control\b/i, /\bprivilege\b/i]
  },
  {
    signal: SIGNALS[2],
    patterns: [/\bpayment?s?\b/i, /\bbilling\b/i, /\binvoice?s?\b/i, /\brefund?s?\b/i, /\bsubscription?s?\b/i, /\bcheckout\b/i]
  },
  {
    signal: SIGNALS[3],
    patterns: [/\bdelete\b/i, /\bremove\b/i, /\bmigration?s?\b/i, /\bdatabase\b/i, /\bschema\b/i, /\brecord?s?\b/i, /\bretention\b/i]
  },
  {
    signal: SIGNALS[4],
    patterns: [/\bapi\b/i, /\bendpoint?s?\b/i, /\bwebhook?s?\b/i, /\bcontract?s?\b/i, /\bintegration?s?\b/i, /\bclient?s?\b/i]
  },
  {
    signal: SIGNALS[5],
    patterns: [/\baudit\b/i, /\blog(?:ging)?s?\b/i, /\bcompliance\b/i, /\bmonitor(?:ing)?\b/i, /\btrace\b/i]
  },
  {
    signal: SIGNALS[6],
    patterns: [/\bui\b/i, /\bfrontend\b/i, /\bscreen\b/i, /\bform\b/i, /\bbutton\b/i, /\bpage\b/i, /\baccessibility\b/i]
  },
  {
    signal: SIGNALS[7],
    patterns: [/\bemail?s?\b/i, /\bnotification?s?\b/i, /\bmessage?s?\b/i, /\bsms\b/i, /\breminder?s?\b/i]
  },
  {
    signal: SIGNALS[8],
    patterns: [/\bconfig(?:uration)?\b/i, /\bsetting?s?\b/i, /\bfeature flag?s?\b/i, /\brollout\b/i, /\benvironment\b/i]
  }
];

const BASE_TESTING = [
  "Add or update unit tests for the changed business rules.",
  "Run regression tests around the most closely related user journey.",
  "Verify validation and error handling for invalid inputs."
];

export function analyseChangeRisk(description: string): ChangeRiskAnalysis {
  const normalisedDescription = description.trim();

  if (normalisedDescription.length === 0) {
    throw new Error("Description is required.");
  }

  const matchedSignals = SIGNAL_PATTERNS
    .filter(({ patterns }) => patterns.some((pattern) => pattern.test(normalisedDescription)))
    .map(({ signal }) => signal);

  const score = matchedSignals.reduce((total, signal) => total + signal.weight, 0);
  const riskLevel = getRiskLevel(score, normalisedDescription);
  const impactedAreas = unique(
    matchedSignals.flatMap((signal) => signal.areas)
  );
  const recommendedTesting = unique([
    ...matchedSignals.flatMap((signal) => signal.testingActivities),
    ...BASE_TESTING
  ]).slice(0, 8);
  const rationale = buildRationale(matchedSignals, score, normalisedDescription);

  return {
    riskLevel,
    impactedAreas: impactedAreas.length > 0 ? impactedAreas : ["Application behaviour"],
    recommendedTesting,
    rationale
  };
}

function getRiskLevel(score: number, description: string): RiskLevel {
  const hasBroadChangeLanguage = /\b(refactor|rewrite|replace|overhaul|migrate|architecture|critical|security)\b/i.test(description);

  if (score >= 7 || (score >= 4 && hasBroadChangeLanguage)) {
    return "High";
  }

  if (score >= 3 || hasBroadChangeLanguage) {
    return "Medium";
  }

  return "Low";
}

function buildRationale(signals: RiskSignal[], score: number, description: string): string[] {
  if (signals.length === 0) {
    return [
      "No high-risk domain keywords were detected, so the change appears localised from the supplied description.",
      "The assessment should be revisited if the implementation touches shared infrastructure, data, or security-sensitive flows."
    ];
  }

  const rationale = signals.map((signal) => `Detected ${signal.label}.`);

  if (score >= 7) {
    rationale.push("Multiple risk signals overlap, increasing the chance of regressions across boundaries.");
  }

  if (/\b(new|add|create|enable)\b/i.test(description)) {
    rationale.push("New behaviour should be covered for successful use, failure handling, and unintended access paths.");
  }

  return unique(rationale).slice(0, 5);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
