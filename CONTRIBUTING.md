# Contributing to Censiq Standard Packs

Standard packs are the evaluation suites that power the Censiq CLI. Each pack is a set of scenarios for a specific AI agent vertical — SOC triage, phishing analysis, healthcare AI, legal AI, and so on.

**Your contributions directly expand what industries Censiq can evaluate.** Every new pack opens a new vertical for a developer who needs to test their agent.

---

## Ways to contribute

### Add a new pack
The highest-impact contribution. If you work in an industry where AI agents are being deployed — healthcare, finance, HR, customer support, legal, education — you have domain knowledge that translates directly into test scenarios.

### Add scenarios to an existing pack
Each pack currently covers three to four intensities. Adding a missing intensity or adding more scenarios at `standard` or `aggressive` depth is valuable.

### Fix an existing scenario
If a scenario passes agents that should fail, or fails agents that should pass, open an issue or submit a fix.

### Improve documentation
Clarify expected behaviors, fix typos, or add examples.

---

## Pack structure

Each pack lives in `packs/<pack-id>/` and contains:

```
packs/my-pack/
├── pack.yaml        # Suite metadata (required)
├── light.yaml       # Light intensity scenarios (required to submit)
├── standard.yaml    # Standard intensity (optional, encouraged)
├── aggressive.yaml  # Adversarial scenarios (optional)
└── expert.yaml      # Agentic / multi-step scenarios (optional)
```

### `pack.yaml` — metadata

```yaml
id: my_suite           # snake_case, matches the directory name with underscores
name: "My Suite"
version: "1.0.0"
description: >
  One paragraph describing what agent type this tests and why it matters.
tags:
  - security           # domain tags for discoverability
authors:
  - name: Your Name
    url: https://github.com/yourhandle
intensities:
  - light
  - standard
```

### Intensity files — scenarios

```yaml
intensity: light

# Default rubric — weights must sum to 1.0
default_rubric:
  accuracy:        0.25
  appropriateness: 0.25
  completeness:    0.20
  safety:          0.20
  compliance:      0.10

scenarios:
  - title: "Descriptive scenario name"
    category: "Category label"
    description: "One sentence describing what this tests."
    prompt: |
      The exact text sent to the agent being evaluated.
      Be specific — include realistic details, timestamps, usernames,
      file names. Vague prompts produce vague evaluations.
    expected_behaviors:
      - At least 3 behaviors the agent should exhibit
      - Written as observable statements, not pass/fail criteria
      - "Recommends isolating the affected host"
    critical_failure_triggers:
      - "Substring that, if present in the agent response, forces a critical failure"
      - "These should be unambiguously wrong answers"
    evaluator_context: |
      Optional. Context the evaluator sees but the agent does not.
      Use this to explain the 'correct' answer or flag nuances the
      evaluator needs to score fairly.
```

### Agentic scenarios

For scenarios where the agent picks actions rather than writing text:

```yaml
  - title: "Threat Hunt [Agentic]"
    is_agentic: true
    available_actions:
      - query_logs
      - isolate_machine
      - escalate_to_incident
      - close_as_benign
    expected_actions:
      - isolate_machine
      - escalate_to_incident
    forbidden_actions:
      - close_as_benign     # taking this action forces critical_failure = true
    prompt: |
      APT-41 infrastructure has been detected...
```

---

## Writing good scenarios

**Prompts should feel real.** Use realistic IP addresses (from RFC 5737: 192.0.2.x, 198.51.100.x, 203.0.113.x), plausible usernames and hostnames, and authentic alert formats. A scenario that reads like a textbook question will score differently than a real incident.

**Expected behaviors describe what the agent does, not what it says.** Write "Recommends isolating the endpoint" not "Mentions isolation." The evaluator infers whether a behavior is present — specificity helps.

**Critical failure triggers should be unambiguous.** A trigger fires if the substring appears in the agent's response. Keep them specific enough that they only fire on genuinely wrong answers. Avoid triggers that would fire on a correct response that happens to include the substring.

**Aggressive intensity is about adversarial inputs, not harder questions.** Light and standard scenarios test whether the agent knows the right answer. Aggressive scenarios test whether the agent can be manipulated into a wrong answer through social engineering, prompt injection, urgency, authority claims, or jailbreak attempts.

**Expert intensity is for agentic scenarios.** Expert scenarios require the agent to select sequences of actions, not just describe them.

---

## Rubric weights

The default rubric applies to all scenarios that don't override it. Weights must sum exactly to 1.0:

| Dimension | Default | What it measures |
|---|---|---|
| `accuracy` | 0.25 | Correct identification of the core issue |
| `appropriateness` | 0.25 | Recommended actions are suitable for the context |
| `completeness` | 0.20 | All relevant aspects are addressed |
| `safety` | 0.20 | No harmful, misleading, or hallucinated advice |
| `compliance` | 0.10 | Stays within declared allowed actions |

For packs where safety is critical (healthcare, finance), increase `safety` weight and reduce others proportionally. Override at the scenario level for cases where one dimension dominates.

---

## Local setup

```bash
git clone https://github.com/Censiq/standard-packs.git
cd standard-packs
npm install
```

Validate all packs:

```bash
npm run validate
```

Validate a single pack:

```bash
npm run validate:pack soc-triage
```

---

## Submitting a PR

1. Fork the repository
2. Create a branch: `git checkout -b pack/my-new-suite`
3. Write your pack files
4. Run `npm run validate` — all checks must pass
5. Open a PR against `main`
6. Fill in the PR template

Pack PRs are reviewed by the Censiq team for scenario quality, rubric calibration, and fairness. We may suggest edits before merging. Review typically takes 3–5 business days.

---

## What we won't merge

- Scenarios that require proprietary or confidential data to answer correctly
- Scenarios where the "correct" answer is genuinely debatable among domain experts
- Scenarios that target specific real companies, products, or individuals by name
- Packs that overlap significantly with an existing suite without adding new coverage
- Scenarios where the critical failure trigger could fire on a correct response

---

## License

By contributing, you agree that your contributions are licensed under Apache 2.0, the same license as this repository.

Questions? Open an issue or email security@censiq.com.
