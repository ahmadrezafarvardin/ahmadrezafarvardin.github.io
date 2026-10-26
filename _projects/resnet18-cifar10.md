---
title: ResNet-18 on CIFAR-10
short: ResNet-18 adapted for 32×32 inputs with a 3×3 stem and no max pooling.
summary: A from-scratch ResNet-18 adapted to CIFAR-10's tiny images, reaching 94.51% test accuracy in about 15 minutes of training.
headline: 94.51% accuracy
kind: Implementation
group: builds
year: 2024–25
featured: true
order: 6
math: true
stats:
  - { label: Test accuracy, value: "94.51%" }
  - { label: Parameters, value: "11.17M" }
  - { label: Training, value: "50 epochs, ~15 min" }
github: https://github.com/ahmadrezafarvardin/resnet18-cifar10
stack: PyTorch · CIFAR-10
notebook: https://colab.research.google.com/github/ahmadrezafarvardin/resnet18-cifar10/blob/main/notebooks/demo.ipynb
notebook_label: Open in Colab
thumb: /assets/img/thumbs/resnet18-cifar10.jpg
thumb_alt: Training and validation loss and accuracy curves over 50 epochs
---

[ResNet-18](https://arxiv.org/abs/1512.03385) was designed for 224×224 ImageNet images. Its stem, a 7×7 stride-2 convolution followed by max pooling, shrinks the input by 4× before the first residual block. On a 32×32 CIFAR image that leaves 8×8 to work with, which throws away most of the spatial detail.

So the stem here is a 3×3 stride-1 convolution with no max pooling. The rest is standard: four stages of two BasicBlocks with [64, 128, 256, 512] channels, adaptive average pooling, a linear head, and He initialisation. Training used SGD (momentum 0.9, weight decay 5×10⁻⁴, batch size 128) with the learning rate annealed from 0.1 to 0 on a cosine schedule, and standard CIFAR augmentation: random 32×32 crops with 4-pixel padding, and horizontal flips.

Identity shortcuts give the gradient a direct path back through every block, which is what keeps deeper networks trainable:

$$y = F(x) + x \quad\Rightarrow\quad \frac{\partial L}{\partial x} = \frac{\partial L}{\partial y}\left(\frac{\partial F}{\partial x} + I\right)$$

<figure>
  <img loading="lazy" decoding="async" src="/assets/img/projects/resnet18/training_curves.png" alt="Training and validation curves over 50 epochs">
  <figcaption>Training and validation over 50 epochs.</figcaption>
</figure>

## Where it gets things wrong

| Class | Acc. | | Class | Acc. |
|---|---|---|---|---|
| ship | 96.8% | | horse | 94.7% |
| automobile | 96.5% | | deer | 93.8% |
| airplane | 95.2% | | bird | 92.1% |
| frog | 95.1% | | dog | 89.5% |
| truck | 95.0% | | cat | 88.4% |

Cats and dogs are the two worst classes. At 32×32, fur and body shape are about all there is to go on. The errors follow visual similarity between classes rather than looking random.
