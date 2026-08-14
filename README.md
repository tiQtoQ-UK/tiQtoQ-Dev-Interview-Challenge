# Software Developer Interview Challenge

Build a **Change Risk Analyser**: a small application that helps a development team understand the testing risk associated with a proposed software change.

The starter repository is ready to run. It deliberately provides a UI starting point while leaving the API framework, contracts, analysis mechanism, and implementation choices to you.

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
apps/
  ui/       Next.js TypeScript UI starter
  api/      TypeScript API workspace — choose and add your own framework
packages/
  shared/   Empty TypeScript workspace for contracts or reusable code you choose to share
```

`apps/api` intentionally has no source files, HTTP framework, routes, or dependencies. `packages/shared` intentionally has no contracts or validation. Define those boundaries as part of your solution; do not use Next.js API routes for the backend.

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
pnpm dev        # start the Next.js UI
pnpm typecheck  # type-check the UI
pnpm lint       # lint the UI
pnpm build      # create a production UI build
```

Add API and shared-package commands as your design requires. Update the root commands if your finished solution needs to run the UI and API together.

## What we value

We assess engineering judgement more than feature quantity. Prioritise clear TypeScript, separation of concerns, appropriate error handling, and highly testable business logic. A small, well-tested solution is preferable to a large feature that is hard to understand or verify.

AI is not required. If you use it, treat it as an external, non-deterministic dependency: make the provider replaceable, validate its output before use, and handle malformed responses or failures deliberately.

## Submission

Please provide your source code, running instructions, assumptions, and a short note on what you would improve with more time. Be ready to discuss your architecture, testing approach, AI usage (if any), and time-based trade-offs.
