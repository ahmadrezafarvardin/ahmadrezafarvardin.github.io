---
layout: page
title: YOLOv3 Object Detection
description: PyTorch implementation from scratch without pretrained weights
img: https://placehold.co/600x400/333333/ffffff?text=YOLOv3
importance: 3
category: work
github: https://github.com/ahmadrezafarvardin/yolov3-detection
---

## Overview

A PyTorch implementation of [YOLOv3](https://arxiv.org/abs/1804.02767) trained on COCO, built entirely from scratch without pretrained weights.

## Results

Training from scratch on COCO val2017 subset (4K images, 30 epochs):

| Component | Epoch 1 | Epoch 30 | Reduction |
|-----------|---------|----------|-----------|
| **Total Loss** | **99.6** | **~32** | **68%** |
| Coord Loss | 47.4 | ~9.5 | 80% |
| Obj Loss | 14.0 | ~9.8 | 30% |
| NoObj Loss | 17.3 | ~2.9 | 83% |
| Class Loss | 20.9 | ~11.3 | 46% |

**Model:** 61.9M parameters | **Training time:** ~3 hours (Colab T4)

### Training Conditions vs Original Paper

| Feature | This Implementation | Original YOLOv3 |
|---|---|---|
| **Training images** | 4,000 | 118,000 |
| **Epochs** | 30 | ~300 equivalent |
| **Backbone** | From scratch | Pretrained on ImageNet |
| **Hardware** | 1× T4 GPU, 3 hours | 8× GPU, ~1 week |
| **Purpose** | Architecture demonstration | State-of-the-art |

## Architecture

The architecture uses a Darknet-53 backbone and a Feature Pyramid Network (FPN) to detect objects at 3 scales.

```text
Input (3×416×416)
│
├── Darknet-53 Backbone
│   ├── Stem: Conv(3→32)
│   ├── Stage 1: ↓2, 64ch,  1 residual block
│   ├── Stage 2: ↓2, 128ch, 2 residual blocks
│   ├── Stage 3: ↓2, 256ch, 8 residual blocks  ──→ route_1 (52×52)
│   ├── Stage 4: ↓2, 512ch, 8 residual blocks  ──→ route_2 (26×26)
│   └── Stage 5: ↓2, 1024ch, 4 residual blocks ──→ route_3 (13×13)
│
├── FPN Neck + Detection Heads
│   ├── Scale 1: ConvSet(1024) → Detect(13×13)  ← large objects
│   │     ↓ upsample + concat(route_2)
│   ├── Scale 2: ConvSet(768)  → Detect(26×26)  ← medium objects
│   │     ↓ upsample + concat(route_1)
│   └── Scale 3: ConvSet(384)  → Detect(52×52)  ← small objects
│
└── Output: 10,647 raw predictions → NMS → final detections
```

### Bounding Box Prediction Math

YOLOv3 predicts coordinates relative to the grid cell ($c_x, c_y$) and anchors ($p_w, p_h$):

$$ b_x = \sigma(t_x) + c_x $$

$$ b_y = \sigma(t_y) + c_y $$

$$ b_w = p_w \cdot e^{t_w} $$

$$ b_h = p_h \cdot e^{t_h} $$

$$ \text{obj} = \sigma(t_o) $$

$$ \text{cls}_i = \sigma(c_i) $$

### Loss Function

A multi-part loss function balancing localization, objectness, and classification:

$$ L = 5 \cdot \text{MSE}_{box} + 1 \cdot \text{BCE}_{obj} + 0.5 \cdot \text{BCE}_{noobj} + 1 \cdot \text{BCE}_{class} $$

## Project Structure

```bash
├── config.py      # All hyperparameters, anchors, paths
├── model.py       # Darknet-53 + FPN + detection heads
├── losses.py      # Multi-scale YOLO loss with stability fixes
├── data.py        # COCO dataset loading and augmentation
├── utils.py       # IoU, NMS, decoding, visualization, checkpoints
├── train.py       # Training loop with resumption support
└── evaluate.py    # Evaluation and prediction diagnostics
```

## Key Implementation Details

### Stability Fix
The original loss can explode due to $$ e^{t_w} $$ producing extreme values. We clamp both predictions and targets to `[-5, 5]` and normalize the no-object loss by its own count rather than by the number of ground truth boxes.

### Resumable Training
Checkpoints (model + optimizer + scheduler + history) are saved every 3 epochs. Training automatically resumes from the latest checkpoint.

### Multi-Scale Detection
9 anchor boxes clustered by k-means, split across 3 detection scales. Each scale uses 3 anchors matched to objects by shape IoU.

## References

- Redmon & Farhadi, ["YOLOv3: An Incremental Improvement"](https://arxiv.org/abs/1804.02767), 2018
- Redmon & Farhadi, ["YOLO9000: Better, Faster, Stronger"](https://arxiv.org/abs/1612.08242), CVPR 2017
- Lin et al., ["Feature Pyramid Networks"](https://arxiv.org/abs/1612.03144), CVPR 2017

## Code

Full implementation available on [GitHub →](https://github.com/ahmadrezafarvardin/YOLOv3-Detection)