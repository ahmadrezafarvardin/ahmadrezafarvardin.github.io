---
layout: page
title: Transformer Translation
description: "'Attention Is All You Need' implemented from scratch in PyTorch"
img: https://placehold.co/600x400/2a2a2a/ffffff?text=Transformer+Architecture
importance: 4
category: work
github: https://github.com/ahmadrezafarvardin/transformer-translation
---

## Overview

A from-scratch PyTorch implementation of **"Attention Is All You Need"** ([Vaswani et al., 2017](https://arxiv.org/abs/1706.03762)), trained on the [Multi30k](https://github.com/multi30k/dataset) dataset for German→English translation.

Every component — multi-head attention, positional encoding, masking, and the Noam learning rate schedule — is implemented from primitives. **No use of `nn.Transformer`.**

## Results

| Metric | Value |
|---|---|
| **Test BLEU** | **37.37** |
| Parameters | ~9.5M |
| Training time | ~5 min (20 epochs, T4 GPU) |
| Architecture | 3 layers, 8 heads, $$d_{model}=256$$, $$d_{ff}=512$$ |

### Example Translations

```text
DE: Ein Mann sitzt auf einem Stuhl.
EN: a man is sitting on a chair.

DE: Zwei Kinder spielen im Park.
EN: two children play in the park.

DE: Leute Reparieren das Dach eines Hauses.
EN: people repair the roof of a house.
```

## Architecture

The implementation follows the paper's encoder-decoder structure exactly, using custom modules for every block:

```text
Source (DE) ──→ [Embedding + Positional Encoding]
                        │
                  ┌─────▼─────┐
                  │  Encoder   │ × N layers
                  │  ┌───────┐ │
                  │  │ Self   │ │
                  │  │ Attn   │ │
                  │  └───┬───┘ │
                  │  │Add+Norm│ │
                  │  ┌───▼───┐ │
                  │  │  FFN  │ │
                  │  └───┬───┘ │
                  │  │Add+Norm│ │
                  └─────┬─────┘
                        │
                  Encoder Output
                        │
Target (EN) ──→ [Embedding + Positional Encoding]
                        │
                  ┌─────▼─────┐
                  │  Decoder   │ × N layers
                  │  ┌───────┐ │
                  │  │Masked │ │
                  │  │Self   │ │
                  │  │ Attn  │ │
                  │  └───┬───┘ │
                  │  │Add+Norm│ │
                  │  ┌───▼───┐ │
                  │  │Cross  │◄──── Encoder Output
                  │  │ Attn  │ │
                  │  └───┬───┘ │
                  │  │Add+Norm│ │
                  │  ┌───▼───┐ │
                  │  │  FFN  │ │
                  │  └───┬───┘ │
                  │  │Add+Norm│ │
                  └─────┬─────┘
                        │
                  [Linear + Softmax]
                        │
                  Output Probabilities
```

### Key Components

| Component | Paper Section | Mathematical Form |
|---|---|---|
| **Scaled Dot-Product** | 3.2.1 | $$ \text{softmax}(\frac{QK^T}{\sqrt{d_k}})V $$ |
| **Multi-Head Attn** | 3.2.2 | Concat($$head_1, \dots, head_h$$)$$W^O$$ |
| **Positional Encoding** | 3.5 | $$ \sin(pos/10000^{2i/d_{model}}) $$ |
| **FFN** | 3.3 | $$ \max(0, xW_1 + b_1)W_2 + b_2 $$ |

## Training Logic

Following the paper's specific optimizer configuration (Section 5.3):

*   **Optimizer:** Adam ($$\beta_1=0.9, \beta_2=0.98, \epsilon=10^{-9}$$)
*   **Regularization:** Dropout=0.1, Label Smoothing $$\epsilon=0.1$$
*   **Noam LR Schedule:** 4000 warmup steps

$$ lr = d_{model}^{-0.5} \cdot \min(step^{-0.5}, step \cdot warmup^{-1.5}) $$

## Attention Masks

Implementing the masks correctly is critical for the Transformer to function. This project handles three distinct types:

1.  **Padding Mask:** Ignores `<pad>` tokens in the encoder and cross-attention.
2.  **Causal (Look-Ahead) Mask:** Ensures the decoder can only attend to previous positions (autoregressive property).
3.  **Combined Mask:** Used in the decoder self-attention to enforce both padding and causal constraints simultaneously.

```python
# Padding mask: (batch, 1, 1, seq_len)
src_mask = (src != PAD_IDX).unsqueeze(1).unsqueeze(2)

# Causal mask: lower triangular (1, 1, tgt_len, tgt_len)
causal = torch.tril(torch.ones(tgt_len, tgt_len)).bool()

# Combined: both constraints must be satisfied
tgt_mask = padding_mask & causal_mask
```

## Project Structure

The codebase is organized for clarity and reusability:

*   `model.py`: Full Transformer architecture (Encoder, Decoder, MultiHeadAttention)
*   `data.py`: Tokenization (SpaCy) and Vocabulary building
*   `train.py`: Training loop with validation and checkpointing
*   `translate.py`: Greedy decoding for inference

## Code

Full implementation available on [GitHub →](https://github.com/ahmadrezafarvardin/transformer-translation)