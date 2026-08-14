# Software Developer Interview Challenge

The tiQtoQ Software Developer Recruitment Challenge

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

## Testability

We place a strong emphasis on automated testing.

Consider:

- how easily your business logic can be tested
- whether external dependencies can be replaced or mocked
- appropriate unit/component/integration tests
- testing behaviour rather than implementation details

You won't lose marks for not achieving exhaustive coverage within the time available.

We'd rather see **a small amount of well-designed, highly testable code** than a large feature that is difficult to test.

---

## AI

AI is **not required** to complete the challenge successfully.

However, additional credit will be given where AI is used effectively.

Examples include:

- using Microsoft Foundry or another LLM to perform the change analysis
- designing the application so that the AI provider/model can easily be replaced
- validating or transforming LLM output before it enters the application
- handling malformed or failed AI responses
- combining deterministic logic with AI rather than simply displaying raw model output

We are particularly interested in seeing AI treated as an **external, non-deterministic dependency** rather than ordinary application logic.

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

These are deliberately optional.

**Do not sacrifice code quality to implement bonus functionality.**

---

# What To Submit

Please provide:

- Your source code
- Instructions for running the application
- Any assumptions you made
- A short explanation of anything you would change or improve given more time

Be prepared to spend a few minutes talking us through:

- your architecture
- your testing approach
- your use of AI, if applicable
- trade-offs you made because of the time constraint

---

# Assessment Guide

The exercise is assessed primarily on engineering judgement rather than feature quantity.

| Area | Weight |
|---|---:|
| Code quality & TypeScript | 20% |
| Software design | 20% |
| Testability & automated tests | 25% |
| Feature implementation | 15% |
| Engineering judgement | 10% |
| AI integration | 10% |

## Exceptional Signals

Additional credit should be considered where a candidate demonstrates:

- dependency inversion around the AI/model implementation
- schema validation of AI responses
- deterministic tests despite using AI
- thoughtful separation between domain logic and infrastructure
- sensible handling of failure, latency or malformed responses
- observability or useful telemetry
- effective use of AI during their own development process