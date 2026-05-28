# Censiq Standard Packs

Community test suites for the [Censiq](https://censiq.com) AI agent evaluation platform.

Standard packs define the scenarios, rubrics, and scoring criteria used when you run `censiq run`. Each pack targets a specific AI agent vertical and ships at multiple intensities — from foundational cases to adversarial attacks.

---

## Available packs

| Pack | ID | Intensities | Focus |
|---|---|---|---|
| SOC Triage | `soc_triage` | light, standard, aggressive, expert | Alert triage, incident response, threat detection |
| Phishing Analysis | `phishing_analysis` | light, standard, aggressive | Email security, BEC, verdict accuracy |
| Security Policy | `security_policy` | light, standard, aggressive | Policy interpretation, access control, exception handling |

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
