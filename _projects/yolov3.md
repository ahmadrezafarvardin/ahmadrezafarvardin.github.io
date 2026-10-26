---
title: YOLOv3, from scratch
short: Darknet-53 and a three-scale detection head trained from random init on 4k COCO images and one GPU.
summary: YOLOv3 implemented in PyTorch and trained on COCO without any pretrained weights, to see how far the architecture gets on a student's compute budget.
headline: no pretrained weights
kind: Implementation
group: builds
year: 2024–25
featured: true
order: 4
math: true
stats:
  - { label: Parameters, value: "61.9M" }
  - { label: Total loss, value: "99.6 → ~32" }
  - { label: Training, value: "~3 h, 1× T4" }
github: https://github.com/ahmadrezafarvardin/YOLOv3-Detection
stack: PyTorch · COCO
notebook: https://colab.research.google.com/github/ahmadrezafarvardin/YOLOv3-Detection/blob/main/notebooks/demo.ipynb
notebook_label: Open in Colab
panel: { value: "61.9M", label: "parameters, trained from random init" }
---

An implementation of [YOLOv3](https://arxiv.org/abs/1804.02767) with no pretrained backbone. The original was trained on 118k images for roughly 300 epochs, starting from an ImageNet-pretrained backbone, on 8 GPUs for about a week. This version gets 4,000 images from COCO val2017, 30 epochs, and a Colab T4 for three hours. The point was never to match the paper's numbers, but to get every part of the detector working and learning.

| | This implementation | Original YOLOv3 |
|---|---|---|
| Training images | 4,000 | 118,000 |
| Epochs | 30 | ~300 equivalent |
| Backbone | random init | ImageNet-pretrained |
| Hardware | 1× T4, ~3 h | 8 GPUs, ~1 week |

## The network

A Darknet-53 backbone feeds a feature-pyramid neck that predicts at three scales: 13×13 for large objects, 26×26 for medium, and 52×52 for small. That gives 10,647 raw boxes per 416×416 image before non-max suppression. Nine anchors, found by k-means, are split three per scale and matched to objects by shape IoU.

Each box is predicted relative to its grid cell $$(c_x, c_y)$$ and anchor $$(p_w, p_h)$$:

$$b_x = \sigma(t_x) + c_x \qquad b_y = \sigma(t_y) + c_y \qquad b_w = p_w e^{t_w} \qquad b_h = p_h e^{t_h}$$

and the loss weights four terms:

$$L = 5\,\mathrm{MSE}_{box} + \mathrm{BCE}_{obj} + 0.5\,\mathrm{BCE}_{noobj} + \mathrm{BCE}_{cls}$$

## Keeping the loss stable

With no pretrained backbone, the early predictions are essentially random, and the $$e^{t_w}$$ term can turn them into enormous box sizes. I guarded against this in three ways: clamping both predictions and targets to $$[-5, 5]$$ before the box loss, normalising the no-object loss by the number of no-object cells instead of the number of ground-truth boxes (otherwise the thousands of empty cells swamp everything else), and clipping gradients.

Total loss fell from 99.6 to about 32 over 30 epochs:

| Loss term | Epoch 1 | Epoch 30 |
|---|---|---|
| Coordinates | 47.4 | ~9.5 |
| Objectness | 14.0 | ~9.8 |
| No-object | 17.3 | ~2.9 |
| Class | 20.9 | ~11.3 |
| **Total** | **99.6** | **~32** |

I report loss rather than COCO mAP on purpose. With 4,000 images and 30 epochs this detector is nowhere near the paper's accuracy, and it was never meant to be: the goal was a complete, correct implementation of every part of YOLOv3.

Checkpoints (model, optimiser, scheduler and loss history) go to Google Drive every three epochs, and training resumes from the latest one automatically, because Colab sessions disconnect.

## References

Redmon & Farhadi, [YOLOv3: An Incremental Improvement](https://arxiv.org/abs/1804.02767), 2018 · Redmon & Farhadi, [YOLO9000](https://arxiv.org/abs/1612.08242), CVPR 2017 · Lin et al., [Feature Pyramid Networks](https://arxiv.org/abs/1612.03144), CVPR 2017
