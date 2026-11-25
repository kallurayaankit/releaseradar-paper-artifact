# ReleaseRadar feasibility pilots

This companion artifact supports the manuscript *Reproducible regression testing evidence in two ReleaseRadar feasibility pilots*, by Ankit Kalluraya. These are exploratory, deterministic replays of known or synthetic examples. The work does not compare AI test generation methods or establish production readiness.

- [Manuscript PDF](paper/ReleaseRadar_Feasibility_Preprint.pdf) and [editable source](paper/manuscript.md)
- [Study A checkout results](results/study-a.json) and [checkout replay](study-a/replay.mjs)
- [Study B task table and totals](results/study-b.json), [companion evaluator](study-b/evaluate.mjs) and [experiment plan](study-b/PLAN.md)

## Verify locally

With Node.js 24 and a POSIX shell, run:

```sh
sh scripts/verify.sh
```

No npm installation, model call, browser or network is needed. Study A freezes the prepared cases and checks correct and fixed fixture controls while comparing known faulty variants. Its fixture modules are exact copies from [the original ReleaseRadar revision](https://github.com/kallurayaankit/release-radar/tree/160bfe589aa593249da10f291cb655de1c40d0a1). Study B copies the source inputs into a temporary directory, runs the oracle self-check, regenerates observations, runs the result audit, then derives the same counts shown in the paper. The datasets are synthetic. The two studies must not be combined into one score.

## Check provenance

In the release Git checkout, with [osaudit](https://github.com/ASSERT-KTH/osaudit) and Poppler installed:

```sh
osaudit
osaudit results --inputs --rerun
```

These checks verify documented numeric references, input hashes, Git provenance and the result commands. They do not constitute peer review or scientific validation.
