---
title: Transformer, from scratch
short: 'The original Transformer rebuilt from primitives for German→English translation, without nn.Transformer.'
summary: A from-scratch PyTorch implementation of "Attention Is All You Need", trained on Multi30k for German→English translation. Every piece, from multi-head attention to the Noam schedule, is written from primitives.
headline: 37.37 BLEU
kind: Implementation
group: builds
year: 2024–25
featured: true
order: 3
math: true
stats:
  - { label: Test BLEU, value: "37.37" }
  - { label: Parameters, value: "~9.5M" }
  - { label: Training, value: "~5 min, 1× T4" }
github: https://github.com/ahmadrezafarvardin/transformer-translation
stack: PyTorch · spaCy tokenisation
---

An implementation of [Vaswani et al., 2017](https://arxiv.org/abs/1706.03762), trained on [Multi30k](https://github.com/multi30k/dataset). Multi-head attention, positional encoding, masking and the learning-rate schedule are all written by hand, without `nn.Transformer`.

The model is a scaled-down version of the paper's base configuration: 3 layers instead of 6, $$d_{model}=256$$ instead of 512, $$d_{ff}=512$$ instead of 2048, with 8 heads kept. The architecture is unchanged, and it trains in about five minutes (20 epochs) on a free Colab T4.

```text
DE  Ein Mann sitzt auf einem Stuhl.
EN  a man is sitting on a chair.

DE  Zwei Kinder spielen im Park.
EN  two children play in the park.

DE  Leute Reparieren das Dach eines Hauses.
EN  people repair the roof of a house.
```

## What's in it

| Component | Paper | Form |
|---|---|---|
| Scaled dot-product attention | §3.2.1 | $$\mathrm{softmax}(QK^\top/\sqrt{d_k})\,V$$ |
| Multi-head attention | §3.2.2 | $$\mathrm{Concat}(\mathrm{head}_1,\dots,\mathrm{head}_h)\,W^O$$ |
| Positional encoding | §3.5 | $$\sin(pos/10000^{2i/d_{model}})$$ |
| Feed-forward | §3.3 | $$\max(0, xW_1+b_1)W_2+b_2$$ |

Training follows §5.3 of the paper: Adam with $$\beta_1=0.9$$, $$\beta_2=0.98$$, $$\epsilon=10^{-9}$$; dropout 0.1; label smoothing 0.1 (§5.4); gradient clipping at norm 1.0; and the Noam schedule with 4000 warmup steps:

$$lr = d_{model}^{-0.5}\cdot\min(step^{-0.5},\ step\cdot warmup^{-1.5})$$

## Getting the masks right

Masks were the hardest part of the implementation. A wrong mask doesn't crash anything: the decoder simply gets to peek at future tokens, or attends to padding, and the numbers look fine until inference. There are three:

1. a **padding mask**, so the encoder and cross-attention ignore `<pad>` tokens;
2. a **causal mask**, so each decoder position only sees earlier positions;
3. their **combination** for decoder self-attention, where both rules apply at once.

```python
# padding mask: (batch, 1, 1, src_len)
src_mask = (src != PAD_IDX).unsqueeze(1).unsqueeze(2)

# causal mask: (1, 1, tgt_len, tgt_len)
causal = torch.tril(torch.ones(tgt_len, tgt_len)).bool()

# decoder self-attention needs both
tgt_mask = padding_mask & causal
```

## Layout

`model.py` holds the encoder, decoder and attention; `data.py` handles spaCy tokenisation and vocabularies; `train.py` runs training with validation and checkpointing; `translate.py` does greedy decoding; `evaluate.py` computes BLEU. A Colab notebook runs the whole pipeline in one session.
