# Locked scope before evaluation

Date: 18 November 2026. Four-task feasibility pilot, a reduction from the proposed 12-task study to verify machinery without spending. This is a new synthetic artifact alongside ReleaseRadar, **not an evaluation of the ReleaseRadar application's execution path**.

Research question: on four separately specified synthetic business rules, how many prepartitioned synthetic faults do fixed baseline examples and a larger deterministic boundary suite detect? No model-generation comparison or causal efficacy claim.

Stopping rule: run exactly the four tasks, three baseline and twelve total boundary cases each, and three development plus three held-out faults per task. Include all faults with valid oracle-confirmed distinguishing witnesses. Ineligible faults remain in raw results with reason; do not silently replace them after evaluation. Report held-out and development counts separately, task-by-task; errors are inconclusive, never kills. No test edits or selective runs after fault reveal. Baseline vs expanded suite differs in test budget (3 vs12), so any difference is descriptive, not evidence of superiority under equal costs.

Isolation: coordinator specified tasks and froze input suites before commissioning fault authorship. Two context-isolated assistant workers receive only specs: one writes oracle with validation and hand-derived self-tests; one writes correct implementation and 3+3 faults per task with witness inputs. They must not inspect frozen test suites or one another's code. Expected assertions will be filled from the oracle before importing faults for evaluation. This is independent code construction within one assistant collaboration, **not independent human review or external replication**. All authors know the broad protocol; shared filesystem access means isolation is procedural, not access-enforced.

Partition meaning: held-out faults are hidden from test-suite construction. No development-fault feedback or model arms are performed. Whole-family separation is desirable but not guaranteed; disclose overlap found on audit. Original public checkout fixtures are not included. All tasks and mutants are synthetic, with no representativeness claim.

Oracle audit: use hand-derived worker tests; compare correct implementation with oracle across a deterministic domain audit set distinct from test suites. Witnesses must lie in input domains and produce a different non-error output. Preserve invalid variants/errors in evidence. Oracle disagreement on a task makes its detection outcomes inconclusive pending review; no posthoc repair in this frozen version.

Replay: save specs, suites, filled expected assertions, implementations, oracle, source hashes, exact environment, raw task/variant observations and witness verdicts. Run twice and compare JSON bytes. No browser, paid API, external publication, inferential statistics or production code changes.

Limits: 4 tasks/12 nominal held-out variants; correlated faults and deliberately chosen boundaries; synthetic author choices; uneven budgets; no human adjudication, production defects, AI efficacy, or proof of oracle correctness. Valid-input behaviors only are scored; invalid-input rejection is harness protection, not measured fault coverage.
