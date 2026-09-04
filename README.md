# tiQtoQ Software Developer Interview Challenge

Build a **Change Risk Analyser**: a small application that helps a development team understand the testing risk associated with a proposed software change.

## Scenario

We build platforms that help software teams integrate AI throughout the Software Development Lifecycle.

Your challenge is to add a small feature to an existing Next.js application that helps a development team understand the **testing risk associated with a software change**.

You should aim to spend approximately **1–2 hours** on the challenge.

---

## The Feature

Build a **Change Risk Analyser**.

A user should be able to enter a description of a proposed software change, for example:

> Add the ability for administrators to reset another user's MFA configuration.

Your application should analyse the change and present useful information back to the development team.

At a minimum, display:

- **Risk Level:** Low / Medium / High
- **Areas potentially impacted**
- **Recommended testing activities**

For example:

### Risk
**High**

### Impacted Areas
- Authentication
- User permissions
- Audit logging
- Security

### Recommended Testing
- Verify only authorised administrators can reset MFA.
- Verify existing MFA users continue to authenticate successfully.
- Verify the reset action is recorded in the audit log.
- Verify users cannot reset another user's MFA through the API without permission.

---

# Requirements

## Required

Your solution should:

- Use **TypeScript**
- Use **Next.js**
- Accept a description of a software change
- Analyse the change
- Present the result clearly to the user
- Be structured in a way that could reasonably be extended in a production application

The analysis mechanism is deliberately left open to you.

You may use:

- deterministic application logic
- an AI model
- a combination of both

We are more interested in your engineering decisions than the visual design of the application.

---

# Things We Value

There isn't one correct implementation.

We will particularly look at the following areas.

## Software Design

We'd like to see code that demonstrates:

- clear separation of concerns
- sensible abstractions
- readable TypeScript
- appropriate error handling
- components/classes/functions with clear responsibilities

Avoid unnecessary complexity — this is a small feature.

---

## Get started

### Prerequisites

- [Node.js 22 LTS](https://nodejs.org/) or later
- Git

The repository pins its `pnpm` version. Corepack, included with supported Node.js releases, will use it automatically.

```powershell
git clone https://github.com/<your-github-user>/Dev-Interview-Challenge.git
Set-Location Dev-Interview-Challenge
corepack enable
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The Change Risk Analyser page is the UI integration point for your work.

## Workspace layout

```
ui/       Next.js TypeScript UI starter
api/      TypeScript API workspace — choose and add your own framework
shared/   Empty TypeScript workspace for contracts or reusable code you choose to share
```

`api` intentionally has no source files, HTTP framework, routes, or dependencies. `shared` intentionally has no contracts or validation. Define those boundaries as part of your solution; do not use Next.js API routes for the backend.

## The challenge

Spend approximately **1–2 hours** adding a feature that accepts a description of a proposed software change and presents a useful analysis to the development team.

For example:

> Add the ability for administrators to reset another user's MFA configuration.

At a minimum, display:

- a risk level: Low, Medium, or High;
- areas potentially impacted; and
- recommended testing activities.

Your solution must use TypeScript, Next.js, and a standalone TypeScript API. The analysis may use deterministic logic, an AI model, or both. AI is optional.

The supplied UI is static on purpose: connect its action to your API and replace the empty assessment states with your result. It is not a partial solution to the challenge.

## Useful commands

```powershell
pnpm dev        # start the Next.js UI and standalone API
pnpm dev:ui     # start only the Next.js UI
pnpm dev:api    # start only the standalone API
pnpm typecheck  # type-check all workspaces
pnpm lint       # lint the UI
pnpm build      # create a production UI build
```

Add API and shared-package commands as your design requires. Update the root commands if your finished solution needs to run the UI and API together.

## What we value

We assess engineering judgement more than feature quantity. Prioritise clear TypeScript, separation of concerns, appropriate error handling, and highly testable business logic. A small, well-tested solution is preferable to a large feature that is hard to understand or verify.

AI is not required. If you use it, treat it as an external, non-deterministic dependency: make the provider replaceable, validate its output before use, and handle malformed responses or failures deliberately.

---

# Bonus Ideas

If you have time, you could implement one or more of the following:

- Generate suggested test cases using AI
- Categorise tests as Unit / Integration / API / UI
- Identify security or accessibility concerns
- Allow the user to regenerate recommendations
- Show why the change was given its risk rating
- Return structured AI output rather than free-form text
- Add observability around AI requests
- Add an abstraction allowing different AI models to be selected
- Deploy the application to Azure
- Add Aspire support (https://aspire.dev) to allow easy local deployment

These are deliberately optional.

**Do not sacrifice code quality to implement bonus functionality.**

---

## Submission

Please provide your source code by opening a PR to your Forked PR and adding `@chrisusher-tt` as the reviewer.

Please document running instructions, assumptions, and a short note on what you would improve with more time. 

Be ready to discuss your architecture, testing approach, AI usage (if any), and time-based trade-offs.

---

## Implemented Solution Notes

The Change Risk Analyser is implemented with deterministic TypeScript rules rather than an AI provider. This keeps the app self-contained for the interview exercise, makes the output repeatable, and avoids needing API keys or model-specific error handling.

### Architecture

- `shared/src/index.ts` contains the shared request/response contracts and the risk analysis logic.
- `api/src/server.ts` exposes a standalone Express API with `POST /analyse-change` and `GET /health`.
- `ui/app/change-risk-analyser.tsx` contains the client-side form, API call, loading state, error state, and structured result rendering.

By default the UI calls `http://localhost:4000`. Override this with `NEXT_PUBLIC_API_BASE_URL` if the API runs elsewhere. The API allows requests from `http://localhost:3000` by default; override this with `UI_ORIGIN`.

### Assumptions

- Risk is inferred from keywords that indicate sensitive domains such as authentication, authorisation, data persistence, billing, public APIs, audit logging, UI, notifications, and configuration.
- Security-sensitive or cross-boundary changes should trend toward Medium or High risk.
- The analysis is advisory and should be reviewed against the actual implementation plan.

### With More Time

- Add focused unit tests around the scoring rules and API validation.
- Add categories for recommended tests such as Unit, Integration, API, and UI.
- Add an optional AI-backed analyser behind the same shared contract, with validated structured output and deterministic fallback behaviour.
