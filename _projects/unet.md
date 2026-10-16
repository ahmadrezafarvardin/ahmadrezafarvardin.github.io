---
title: U-Net with attention gates
short: Pet-vs-background segmentation on Oxford-IIIT Pets with a modernised U-Net and a BCE + Dice loss.
summary: A from-scratch U-Net with attention gates on the skip connections, trained for pet-vs-background segmentation on Oxford-IIIT Pets.
headline: 0.8375 IoU
kind: Implementation
group: builds
year: 2024–25
featured: true
order: 5
math: true
image: /assets/img/projects/unet/predictions.png
stats:
  - { label: IoU, value: "0.8375" }
  - { label: Dice, value: "0.9116" }
  - { label: Pixel accuracy, value: "94.6%" }
  - { label: Training, value: "~39 min, 1× T4" }
github: https://github.com/ahmadrezafarvardin/unet-segmentation
stack: PyTorch · Oxford-IIIT Pets
---

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/unet/predictions.png" alt="Rows of pet photos with their ground-truth masks and the model's predicted masks">
  <figcaption>Input, ground-truth mask, prediction.</figcaption>
</figure>

The task is to separate the pet from the background in each image of [Oxford-IIIT Pets](https://www.robots.ox.ac.uk/~vgg/data/pets/). The model is a 29.3M-parameter U-Net that keeps the [2015 design](https://arxiv.org/abs/1505.04597) but updates most of the details:

| | Original (2015) | This version |
|---|---|---|
| Normalisation | none | BatchNorm |
| Padding | valid, output shrinks | same, output = input |
| Upsampling | transposed conv | bilinear + 1×1 conv |
| Skip connections | crop + concat | direct concat |
| Attention | none | attention gates |
| Dropout | none | 0.1 in deep layers |
| Loss | cross-entropy | BCE + Dice |

The attention gates sit on each skip connection. They use the coarser decoder features to decide which encoder features to pass through, so background clutter gets suppressed before it is concatenated back in.

## Loss

To handle the imbalance between pet and background pixels, I combined per-pixel binary cross-entropy with Dice loss, which scores the overlap of the whole mask:

$$\mathcal{L} = 0.5\,\mathcal{L}_{BCE} + 0.5\,\mathcal{L}_{Dice}, \qquad \mathcal{L}_{Dice} = 1 - \frac{2\sum_i p_i g_i + \epsilon}{\sum_i p_i + \sum_i g_i + \epsilon}$$

Training ran for 30 epochs on 128×128 images (batch size 16) with AdamW (learning rate 1e-3, weight decay 1e-4), CosineAnnealingWarmRestarts, and augmentations (horizontal and vertical flips, ±15° rotation, colour jitter) applied identically to each image and its mask.

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/unet/training_curves.png" alt="Training and validation loss and IoU over 30 epochs">
  <figcaption>Loss and IoU over 30 epochs.</figcaption>
</figure>

## Results

On the test set: IoU 0.8375, Dice 0.9116, pixel accuracy 94.60%, precision 89.61%, recall 92.76%. Recall is higher than precision, so the model's errors lean toward labelling background pixels as pet rather than missing parts of the animal. The code has a `--no-attention` switch for comparing against a plain U-Net.
