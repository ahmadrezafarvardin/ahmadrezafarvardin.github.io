---
title: River surface velocity from video
short: RAFT optical flow for unseeded footage, OpenPIV for seeded footage, calibrated per camera setup.
summary: Measuring how fast a river flows using only video of its surface, with deep optical flow where there's nothing to track and classical PIV where there is.
headline: R² 0.77 · 22 videos
kind: Research project
group: research
year: 2024
featured: true
order: 1
stats:
  - { label: R², value: "0.77" }
  - { label: MAE, value: "0.36 m/s" }
  - { label: RMSE, value: "0.58 m/s" }
  - { label: Field videos, value: "22" }
github: https://github.com/ahmadrezafarvardin/river_velocity_estimation
stack: PyTorch · RAFT · OpenPIV · OpenCV
notebook: https://github.com/ahmadrezafarvardin/river_velocity_estimation/blob/master/notebooks/02_colab_pipeline.ipynb
notebook_label: Colab notebook
panel: { value: "R² 0.77", label: "on 22 real-world river videos" }
---

Measuring river discharge usually means putting instruments in the water. The idea here is to get surface velocity from video instead, which is cheap and safe but turns a hydrology problem into a motion-estimation problem with messy real-world footage.

The footage falls into two kinds, and each gets a different method:

<ol class="pipeline">
  <li><b>Preprocess</b> Resize to 1280×720, use up to 100 frames per video, fix wrong FPS metadata</li>
  <li><b>Seeded?</b> Visible tracer particles on the surface, or not</li>
  <li><b>Estimate flow</b> OpenPIV cross-correlation if seeded, RAFT optical flow if not</li>
  <li><b>Calibrate</b> Map pixel displacement to m/s, cross-validated across camera setups</li>
  <li><b>Evaluate</b> Compare against measured surface velocities</li>
</ol>

## Two methods, one pipeline

**OpenPIV** handles videos with visible seeding particles. It splits each frame into small interrogation windows and cross-correlates them between frames to find how far the particles moved. It is fast and well understood, but it needs texture to lock onto.

**RAFT** handles unseeded and thermal videos, where a smooth water surface gives PIV almost nothing to correlate. I used the pretrained model from the Princeton Vision group to estimate dense per-pixel flow between consecutive frames.

Preprocessing needed care too. Some videos had wrong frame-rate metadata, and since velocity is displacement × FPS, those would have been silently off by a constant factor. They get manual FPS overrides in the config.

## Calibration

Turning pixels per frame into metres per second depends on camera height, angle and lens, which changed from video to video. I used a cross-validated calibration across camera setups. Some videos had too few ground-truth calibration points, and that reduced the precision of their estimates. More calibration points per camera setup is the most direct way to improve these numbers.

## Results

Across 22 real-world river videos recorded under varying conditions, the pipeline reached R² = 0.77, with a mean absolute error of 0.36 m/s and RMSE of 0.58 m/s.
