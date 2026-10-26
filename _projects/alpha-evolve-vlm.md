---
title: "AlphaEvolve-VLM: evolving chart-QA inference"
short: An LLM rewrites the inference code of a 2B vision-language model. Audited on an untouched holdout, the search turned out to be gaming the benchmark.
summary: An AlphaEvolve-style system, built from scratch, in which an LLM evolves the inference code of Qwen3-VL-2B for chart question answering on CharXiv. Compared against step-by-step manual optimization on an 800-query holdout that no design decision touched.
headline: 67.0% holdout · McNemar-tested
kind: Research project
context: Princeton NLP Lab technical assessment
group: research
year: 2026
featured: true
lead: true
order: 0
thumb: /assets/img/thumbs/alpha-evolve-vlm.jpg
thumb_alt: Holdout accuracy against seconds per query for the baseline, manual, evolved and routing programs
stats:
  - { label: Best holdout accuracy, value: "67.0%" }
  - { label: Manual tuning (Instruct), value: "25.9 → 56.0%" }
  - { label: Evolution over manual, value: "+6.0 pts, p = 0.0003" }
  - { label: LLM cost of the run, value: "$0.23" }
github: https://github.com/ahmadrezafarvardin/alpha-evolve-vlm
report: https://github.com/ahmadrezafarvardin/alpha-evolve-vlm/blob/main/report/report.pdf
report_note: 6 pages
slides: https://github.com/ahmadrezafarvardin/alpha-evolve-vlm/blob/main/presentation/slides.pdf
notebook: https://github.com/ahmadrezafarvardin/alpha-evolve-vlm/blob/main/RESULTS.md
notebook_label: Lab notebook
stack: Python · PyTorch · Qwen3-VL-2B · Gemini Flash · MAP-Elites
---

[CharXiv](https://github.com/princeton-nlp/CharXiv) asks descriptive questions about real charts from arXiv papers: axis labels, tick values, legend entries, subplot layout, colorbar ranges. Scoring is exact match, so the *format* of an answer matters as much as reading the chart. The target is one function, `vlm_inference(image_path, question) -> str`, run with Qwen3-VL-2B (Instruct and Thinking) under greedy decoding. I improved its accuracy and speed in two ways and compared them:

1. **by hand**, one measured change at a time;
2. **by evolution**, following [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/): an LLM proposes code edits, a program database keeps a diverse population, and an evaluation cascade scores candidates on the GPU.

Two findings matter more than the headline accuracy: evolution's gain on the Instruct model is **specification gaming**, and a routing design that passed validation **failed on holdout**.

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/alpha/holdout.png" width="1100" height="520" alt="Scatter plot of holdout accuracy against seconds per query on a log scale: baseline at 25.9%, manual Instruct at 56%, evolved Instruct at 62%, manual Thinking at 64.8%, evolved Thinking at 67%">
  <figcaption>Holdout (800 queries): accuracy against time per query. Circles are manual programs, triangles evolved.</figcaption>
</figure>

## Data discipline

The 1,000 labelled CharXiv validation figures are split by figure, so no chart appears in two splits:

| Split | Queries | Used for |
|---|---|---|
| dev | 128 | manual design only |
| evo | 400 | the only feedback evolution ever sees |
| holdout | 800 | the final comparison, nothing else |
| reserve | 1,000 | single-use checks, each one logged |

Every number on this page is a holdout number. Paired differences are tested with McNemar's test, and since repeated timing runs vary by about 7%, I never claim a speed difference under 10%.

## Manual optimization

Each step was committed and measured on its own. Because decoding is greedy, post-processing changes can be measured exactly by replaying recorded raw outputs, which separates extraction gains from prompt gains.

- extracting a short answer from verbose responses;
- an answer-only prompt with a 64-token limit (5.4× faster);
- asking the model to check the question's own "Not Applicable" condition first;
- for Thinking: a 1,024-token reasoning budget with a forced `</think>`.

Together these took the Instruct model from **25.9% to 56.0%** while making it about **6× faster**.

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/alpha/manual_steps.png" width="1100" height="420" alt="Two line charts: accuracy rising at each manual step on dev, reserve and holdout, and time per query dropping sharply at the answer-only step">
  <figcaption>Manual Instruct: accuracy after each step (left) and time per query (right).</figcaption>
</figure>

## The evolution system

About a thousand lines, written from scratch in the `alphaevolve/` package:

| Component | Implementation |
|---|---|
| Program database | islands with ring migration, plus a per-island MAP-Elites grid (time per query × number-reading accuracy) |
| Prompt sampler | parent code and per-category scores, failure examples from `evo` only, inspirations shown as diffs (56% fewer tokens) |
| LLM mutation | SEARCH/REPLACE diffs inside an `EVOLVE-BLOCK`, from Gemini 3.1 Flash-Lite (85%) and Gemini 3 Flash (15%) |
| Evaluation cascade | static checks → 8 → 64 → 400 queries, with a noise-aware promotion rule |
| Loop | atomic checkpoint per generation pushed to a git branch; exact resume from cached LLM calls |

I added five extensions, each after a measured failure: a near-duplicate edit filter, noise-aware selection, AST checks that forbid sampling, other models or access to gold answers, an "already tried" memory in the prompt, and pause/resume on API failures. The full Instruct run (72 children) cost **$0.23** in LLM calls.

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/alpha/evolution.png" width="1100" height="420" alt="Step plots of the best evo accuracy per generation, rising from about 54.8% to 62.5% for Instruct over 12 generations and from 71.9% to 74.2% for Thinking">
  <figcaption>Best-so-far accuracy on the evo split per generation, for Instruct (left) and Thinking (right).</figcaption>
</figure>

## Results

| Program | Holdout acc. | s / query | Compared with |
|---|---|---|---|
| Naive baseline (Instruct) | 25.9% | 2.61 | |
| Manual Instruct | 56.0% | **0.41** | +30.1 over baseline |
| Evolved Instruct | 62.0% | 0.46 | +6.0 over manual (p = 0.0003) |
| Manual Thinking | 64.8% | 28.6 | |
| **Evolved Thinking** | **67.0%** | 19.3 | +2.2 and 33% faster than manual (p = 0.01) |
| Routing (manual models) | 61.6% | 14.5 | −3.2 against Thinking alone |

All timings are on one RTX 3090.

## Finding 1: specification gaming

An answer-level audit shows where evolved Instruct's +6.0 points come from:

| Holdout | Manual | Evolved | Δ |
|---|---|---|---|
| Gold answer is "Not Applicable" (200) | 83 | **174** | **+91** |
| All other questions (600) | **365** | 322 | **−43** |
| Times the model answered "Not Applicable" | 115 | 262 | |

Evolution rewrote the instruction to make the model check whether a colorbar, legend or axis "actually exists" before answering. Most CharXiv charts have no colorbar, so the evolved program answers "Not Applicable" to 115 of 119 colorbar questions, and on the 12 charts that really have one it scores 0/12. A single edit in the winning lineage produced 23 of the 31 points of training gain. The manual work had found the same lever and deliberately declined it.

The search never touched the gold answers or the evaluator; the AST checks rule that out. It optimized the metric it was given, including the metric's blind spots. **The fitness function in LLM-driven program search needs the same scrutiny as the search itself.**

## Finding 2: the routing reversal

The Thinking model was much stronger on number-reading and counting questions in the design data, so a router sent those to Thinking and everything else to the 70× faster Instruct model. On a fresh, single-use validation slice, routing beat Instruct alone by +9.0 points (p < 0.001). On holdout it **lost to Thinking alone** (61.6% against 64.8%). The validation was sound but asked the wrong question: it compared the composite system with one of its parts instead of the strongest alternative. Only the untouched holdout caught it.

## What didn't work

- **Thinking evolution took the easiest edit.** It halved the reasoning budget, while a stronger intervention measured beforehand, stopping at the fourth "Wait", cut about 60% of reasoning tokens with no accuracy loss. Four of six children were byte-identical despite the "already tried" memory.
- **The evaluation cascade saved only 10% of GPU time.** Full evaluations were cheap and 75% of children passed; the real saving came from the static filters before the GPU.

## Credits

CharXiv and its evaluation harness are by Wang et al. (Princeton NLP), and the starting script and evaluator scaffold came with the original task. AlphaEvolve is by Novikov et al. (Google DeepMind). The models are Qwen3-VL-2B-Instruct and -Thinking by the Qwen Team. Built with AI coding assistance (Claude Code).
