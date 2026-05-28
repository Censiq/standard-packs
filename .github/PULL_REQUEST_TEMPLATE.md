## What does this PR add or change?

<!-- New pack, new intensity, bug fix, scenario edit — describe it briefly -->

## Pack / intensity affected

- Pack: `packs/___`
- Intensity: `light` / `standard` / `aggressive` / `expert`

## Checklist

- [ ] `npm run validate` passes with no errors
- [ ] Every scenario has at least 3 `expected_behaviors`
- [ ] Every scenario has at least 1 `critical_failure_trigger`
- [ ] Rubric weights sum to 1.0 (or `default_rubric` is inherited)
- [ ] Agentic scenarios include `available_actions`, `expected_actions`, and `forbidden_actions`
- [ ] Scenario prompts do not reference specific real individuals, live credentials, or real IP addresses
- [ ] For new packs: `pack.yaml` is included with `id`, `name`, `version`, `description`, and `intensities`

## Testing notes

<!-- How did you verify the scenarios behave as intended? Any edge cases? -->
