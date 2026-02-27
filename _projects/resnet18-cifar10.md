---
layout: page
title: ResNet-18 on CIFAR-10
description: From-scratch PyTorch implementation achieving 94.51% test accuracy
img: assets/img/projects/resnet18/training_curves.png
importance: 1
category: work
github: https://github.com/ahmadrezafarvardin/resnet18-cifar10
---

## Overview

A from-scratch PyTorch implementation of [ResNet-18](https://arxiv.org/abs/1512.03385) trained on CIFAR-10, achieving **94.51% test accuracy**. The architecture is adapted for 32×32 images with a modified stem (3×3 conv, stride 1, no max pooling) to preserve spatial resolution.

The core insight of residual learning is that identity shortcuts enable direct gradient flow, solving the degradation problem in deep networks:

$$y = F(x) + x \quad \Rightarrow \quad \frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot \left(\frac{\partial F}{\partial x} + I\right)$$

<div class="row justify-content-sm-center">
    <div class="col-sm-10 mt-3 mt-md-0">
        {% include figure.liquid 
           loading="eager" 
           path="assets/img/projects/resnet18/training_curves.png" 
           title="Training curves" 
           class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    Training and validation curves over 50 epochs. Final test accuracy: 94.51%.
</div>

## Results

| Metric | Value |
|--------|-------|
| **Test Accuracy** | **94.51%** |
| Parameters | 11.17M |
| Epochs | 50 |
| Training Time | ~15 min (T4 GPU) |
| Optimizer | SGD (momentum=0.9, weight decay=5×10⁻⁴) |
| LR Schedule | Cosine annealing |

## Architecture

ResNet-18 adapted for CIFAR-10's 32×32 resolution:

- **Stem:** 3×3 conv, stride 1 (not 7×7 stride 2)
- **No max pooling** after stem
- **4 residual stages:** [64, 128, 256, 512] × 2 BasicBlocks
- **Head:** AdaptiveAvgPool → Linear(512, 10)
- **Init:** He (Kaiming) normal

## Per-Class Performance

| Class | Accuracy |
|-------|----------|
| ship | 96.8% |
| automobile | 96.5% |
| airplane | 95.2% |
| frog | 95.1% |
| truck | 95.0% |
| horse | 94.7% |
| deer | 93.8% |
| bird | 92.1% |
| dog | 89.5% |
| cat | 88.4% |

Cat and dog are the hardest classes — they share visual features (fur texture, body shape) that make fine-grained discrimination challenging at 32×32 resolution.

## Key Takeaways

- **Architectural adaptation matters.** ImageNet's 7×7 stem destroys spatial information on 32×32 images. The 3×3 stem is essential.
- **Cosine annealing** provides smoother convergence than step decay at this training scale.
- **Error patterns are semantically meaningful.** Class confusion follows visual similarity, not random misclassification.

## Code

Full implementation: [GitHub →](https://github.com/ahmadrezafarvardin/resnet18-cifar10)