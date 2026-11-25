---
title: "Reproducible regression testing evidence in two ReleaseRadar feasibility pilots"
author: "Ankit Kalluraya"
date: "Independent researcher"
lang: en-AU
---

## Abstract

Two exploratory pilots examine how to make regression-test results inspectable and reproducible. In a prepared checkout example, the starter suite detected [one of three seeded faults](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json) and the expanded suite detected [all three](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json). In a separate synthetic companion harness, the starter and expanded suites detected [two of twelve and twelve of twelve eligible held-out implementations](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json), respectively. The expanded suites contained more tests, and no runtime model-generation treatment was evaluated. The results establish feasibility for these fixtures, not comparative efficacy, production safety or generalisation.

## Motivation and related work

A test failure can mean that an implementation is faulty, that an expected value is wrong, or that the runner did not produce usable evidence. A useful regression report should let a reader distinguish those cases. ReleaseRadar pairs frozen tests and requirement-derived expectations with observations from correct and deliberately altered implementations. The question here is whether those observations can be replayed and traced to their source.

MuTAP uses surviving mutants to guide language-model test generation [1]. TestGen-LLM filters generated candidates for properties such as buildability, reliable execution and coverage improvement [2]. Those studies establish prior work on mutation feedback and generated-test validation. The present work is distinct in scope: it characterises evidence from a prepared demonstration and a separate deterministic harness. It proposes no new test-generation algorithm and does not compare its results against those studies.

## Study A: prepared checkout replay

The checkout fixture applies a free-shipping threshold to the subtotal after discounts, in integer cents. The affected rule was exercised against the correct implementation, the corrected implementation and seeded alternatives covering discount order, equality at the threshold and rounding. The copied fixture modules are exact extracts from the [pinned ReleaseRadar revision][fixture]. The release replay freezes each suite, checks both passing controls and records which alternatives fail under the same assertions.

The exploratory starter suite contained [three cases](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json) and detected [one of three alternatives](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json), the threshold equality fault. The expanded suite retained the original tests, used [six cases](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json) in total and detected [all three alternatives](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-a.json). Codex prepared the additions during development with knowledge of the seeded faults. This is a known-fault replay; the case count differs between suites, and live model generation, browser rendering and deployment were not evaluated.

## Study B: separate synthetic companion harness

The companion harness covers discount, tax, refund and eligibility rules. It derives assertions from a rule-based oracle and freezes the inputs before importing fault implementations during replay. In the original pilot, suite inputs were frozen before fault implementations were commissioned under procedural context separation, not externally enforced separation or preregistration. A fault implementation is eligible only if a witness distinguishes its output from the oracle. A runner error or failed control cannot count as fault detection. The expanded suites include the baseline cases.

The exploratory starter and expanded suites used [three and twelve cases per task](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json), respectively. Each result in the table counts detected implementations out of the eligible held-out implementations for that row. Oracle pairs are deterministic comparisons of the correct implementation against the independently derived rule code within the authored audit grid.

| Task | Starter | Expanded | Oracle pairs | Study type |
|:---|---:|---:|---:|:---|
| Discount | [2/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [3/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [20,001](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | Exploratory |
| Tax | [0/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [3/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [5,226](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | Exploratory |
| Refund | [0/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [3/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [15,872](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | Exploratory |
| Eligibility | [0/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [3/3](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | [12,322](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) | Exploratory |
| **Total** | **[2/12](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json)** | **[12/12](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json)** | **[53,421](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json)** | Exploratory |

In this exploratory replay, there were [zero oracle disagreements](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/results/study-b.json) on the enumerated inputs. Only the discount and eligibility grids exhaust the specified domains. Tax samples inputs and does not cover fractional rounding in its audit grid; refund uses small balances. These comparisons are not independent statistical observations. In addition, held-out variants are distinct implementations, not necessarily distinct fault families.

## Interpretation

A larger deterministic suite that includes the baseline cannot lose a previously observed detection on the same pure implementations. The companion result therefore cannot separate case selection from suite size. The checkout additions were also informed by known faults. Both pilots are small and synthetic; a shared misreading of a requirement could affect the oracle and implementation together. The results do not measure live AI benefit or predict release safety.

A follow-on comparison should fix case and compute budgets, use fresh rules and separate fault families where practicable, and report failed controls, runner errors and abstentions alongside valid detections. The present fixtures have been exposed and should not be treated as unseen test material in that comparison.

## Artifact availability and contributions

The companion artifact contains the [checkout replay](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/study-a/replay.mjs), [synthetic harness](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/study-b/evaluate.mjs), and [verification command](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/scripts/verify.sh). The table is derived from the synthetic harness observations by the [Study B result producer](https://github.com/kallurayaankit/releaseradar-paper-artifact/blob/67ec170516153fb21d07153a89d1248a1e1f0295/study-b/replay.mjs). The archived internal review package is not required for either replay. The links identify files at a fixed artifact revision.

Ankit Kalluraya is the named author. AI assistants contributed to the specifications, tests, fixture implementations, analysis and manuscript draft; the checkout additions were prepared by Codex. Context separation between assistant-authored components did not constitute independent human review. This is a preprint candidate and has not been peer reviewed.

[fixture]: https://github.com/kallurayaankit/release-radar/tree/160bfe589aa593249da10f291cb655de1c40d0a1

## References

[1] Moradi Dakhel, A., Nikanjam, A., Majdinasab, V., Khomh, F., and Desmarais, M. C. (2023). *Effective Test Generation Using Pre-trained Large Language Models and Mutation Testing*. [arXiv:2308.16557](https://arxiv.org/abs/2308.16557).

[2] Alshahwan, N., Chheda, J., Finegenova, A., Gokkaya, B., Harman, M., Harper, I., Marginean, A., Sengupta, S., and Wang, E. (2024). *Automated Unit Test Improvement using Large Language Models at Meta*. [arXiv:2402.09171](https://arxiv.org/abs/2402.09171).
