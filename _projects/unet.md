---
layout: page
title: U-Net Segmentation
description: PyTorch implementation with Attention Gates achieving 0.8375 IoU
img: assets/img/projects/unet/predictions.png
importance: 2
category: work
github: https://github.com/ahmadrezafarvardin/unet-segmentation
---

## Overview

A PyTorch implementation of a **modern U-Net** with **Attention Gates** for binary semantic segmentation, trained on the [Oxford-IIIT Pets](https://www.robots.ox.ac.uk/~vgg/data/pets/) dataset.

The model achieves **0.8375 IoU** and **0.9116 Dice** on the test set, utilizing a modified architecture that integrates batch normalization and attention mechanisms to focus on relevant spatial features.

<div class="row justify-content-sm-center">
    <div class="col-sm-12 mt-3 mt-md-0">
        {% include figure.liquid 
           loading="eager" 
           path="assets/img/projects/unet/predictions.png" 
           title="Segmentation Predictions" 
           class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Qualitative results: Input image, Ground Truth mask, and Model Prediction.
</div>

## Results

| Metric | Value |
|--------|-------|
| **IoU (Jaccard)** | **0.8375** |
| **Dice (F1)** | **0.9116** |
| Pixel Accuracy | 94.60% |
| Precision | 89.61% |
| Recall | 92.76% |
| Parameters | 29.3M |
| Training Time | ~39 min (T4 GPU) |

## Architecture

This implementation modernizes the [original 2015 U-Net](https://arxiv.org/abs/1505.04597) by adding Attention Gates and structural improvements:

```text
Encoder                    Decoder
────────                   ───────
(3)  → [Conv²] → (64)  ──attention──→ [Conv²] → (64)  → 1×1 Conv → (1)
         ↓ pool                              ↑ upsample
(64) → [Conv²] → (128) ──attention──→ [Conv²] → (128)
         ↓ pool                              ↑ upsample
(128)→ [Conv²] → (256) ──attention──→ [Conv²] → (256)
         ↓ pool                              ↑ upsample
(256)→ [Conv²] → (512) ──attention──→ [Conv²] → (512)
         ↓ pool                              ↑ upsample
              [Conv²] → (1024)
               Bottleneck
```

| Feature | Original (2015) | This Implementation |
|---------|-----------------|---------------------|
| **Normalization** | None | BatchNorm |
| **Padding** | Valid (output shrinks) | Same (output = input) |
| **Upsampling** | Transposed conv | Bilinear + 1×1 conv |
| **Skip connections** | Crop + concat | Direct concat |
| **Attention** | None | **Attention Gates** |
| **Loss** | Cross-entropy | BCE + Dice |

## Loss Functions

To handle class imbalance (background vs. pet), a combined loss function is used:

**Binary Cross-Entropy** (per-pixel):

$$ \mathcal{L}_{BCE} = -\frac{1}{N}\sum_{i}[y_i \log(p_i) + (1-y_i)\log(1-p_i)] $$

**Dice Loss** (global overlap):

$$ \mathcal{L}_{Dice} = 1 - \frac{2\sum_i p_i g_i + \epsilon}{\sum_i p_i + \sum_i g_i + \epsilon} $$

**Combined:**

$$ \mathcal{L} = 0.5 \cdot \mathcal{L}_{BCE} + 0.5 \cdot \mathcal{L}_{Dice} $$

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid 
           loading="eager" 
           path="assets/img/projects/unet/training_curves.png" 
           title="Training Curves" 
           class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Training and validation loss/IoU curves over 30 epochs.
</div>

## Project Structure

The codebase is modular and designed for reproducibility:

- `model.py`: U-Net architecture (ConvBlock, AttentionGate, UNet)
- `train.py`: Training loop with CosineAnnealingWarmRestarts
- `losses.py`: Custom Dice and Combined Loss implementations
- `data.py`: Dataset handling with synchronized augmentations (Flip, Rotate, ColorJitter)

## Code

Full implementation available on [GitHub →](https://github.com/ahmadrezafarvardin/unet-segmentation)