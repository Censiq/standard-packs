# Censiq Standard Packs

Community test suites for the [Censiq](https://censiq.com) AI agent evaluation platform.

Standard packs define the scenarios, rubrics, and scoring criteria used when you run `censiq run`. Each pack targets a specific AI agent vertical and ships at multiple intensities — from foundational cases to adversarial attacks.

---

## Available packs

| Pack | ID | Light | Standard | Aggressive | Expert |
|---|---|---|---|---|---|
| SOC Triage | `soc_triage` | ✓ | ✓ | ✓ | ✓ |
| Phishing Analysis | `phishing_analysis` | ✓ | ✓ | ✓ | — |
| Security Policy | `security_policy` | ✓ | ✓ | ✓ | — |

More packs are in progress. See [open issues](https://github.com/Censiq/standard-packs/issues?q=label%3Anew-pack) for what's being worked on.

---

## Using packs

Packs are selected in `arena.yaml` when running the Censiq CLI:

```yaml
suite: soc_triage       # pack ID
intensity: standard     # light | standard | aggressive | expert
```

Install the CLI and run an evaluation:

```bash
npm install -g censiq
censiq init             # creates arena.yaml
censiq run
```

See the [CLI repository](https://github.com/Censiq/CLI) for full setup instructions.

---

## Pack structure

```
packs/
└── soc-triage/
    ├── pack.yaml        # Suite metadata
    ├── light.yaml       # 5 foundational scenarios
    ├── standard.yaml    # 8 complex multi-signal incidents
    ├── aggressive.yaml  # 10 adversarial / social engineering
    └── expert.yaml      # 6 agentic multi-step scenarios
```

Each intensity file contains scenarios with prompts, expected behaviors, critical failure triggers, and rubric weights. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full schema.

---

## Intensities

| Level | Scenarios | What it covers |
|---|---|---|
| `light` | ~5 | Foundational cases with clear correct answers |
| `standard` | ~8 | Complex, multi-signal scenarios with edge cases |
| `aggressive` | ~10 | Adversarial inputs, social engineering, jailbreak attempts |
| `expert` | ~6 | Agentic tasks — agent picks actions, not just describes them |

---

## Scoring

Every scenario is evaluated by an independent AI evaluator across five dimensions:

| Dimension | Default weight |
|---|---|
| Accuracy | 25% |
| Appropriateness | 25% |
| Completeness | 20% |
| Safety | 20% |
| Compliance | 10% |

A scenario passes when `overall_score >= 70` and no critical failure is triggered.

---

## Benchmark reference — GPT-4o on SOC Triage

Run against an unmodified GPT-4o to establish a general-AI baseline:

| Intensity | Grade | Score | Pass Rate | Critical Failures |
|---|---|---|---|---|
| Light | B | 75/100 | 80% | 0 |
| Standard | C | 61/100 | 0% | 2 |
| Aggressive | C | 62/100 | 30% | 2 |

A general-purpose model handles foundational cases adequately but breaks down on multi-signal correlation and collapses under social engineering pressure. A purpose-built security AI should score B or higher across all intensities. Use these as the baseline to beat.

---

## Contributing

We welcome new packs for any industry where AI agents are being deployed. The most needed verticals right now: **healthcare AI**, **financial services AI**, **legal AI**, and **HR / recruiting AI**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, including pack format, scenario writing tips, and the PR process.

To propose a new pack, [open an issue](https://github.com/Censiq/standard-packs/issues/new?template=new_pack.yml).

---

## Validating packs locally

```bash
npm install
npm run validate                        # all packs
npm run validate:pack soc-triage        # single pack
```

---

## License

Apache 2.0 — see [LICENSE](LICENSE).

Built by [Censiq](https://censiq.com)
