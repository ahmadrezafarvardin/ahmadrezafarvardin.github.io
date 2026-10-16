---
title: Handwritten math recognition
short: Detect the symbols, then read the whole expression end to end with a CRNN trained with CTC loss.
summary: Reading Persian handwritten mathematical expressions, from locating each symbol to producing the expression as a string. Final project for the Machine Learning course; took 1st place in the course's Quera competition.
headline: 1st place · 92.3% mAP
kind: Course project
context: 1st place, Quera competition
group: research
year: 2024
featured: true
order: 2
stats:
  - { label: Detection mAP (YOLOv8), value: "92.3%" }
  - { label: Detection mAP (Faster R-CNN), value: "89.7%" }
  - { label: Expression accuracy, value: "54.35%" }
  - { label: Mean edit distance, value: "0.83" }
github: https://github.com/ahmadrezafarvardin/ML-finalProject-UT
stack: PyTorch · YOLOv8 · Faster R-CNN · scikit-learn
---

This was the final project for the Machine Learning course at the University of Tehran, run as a competition on Quera. The input is an image of a handwritten expression such as `(5-2)/3`, and the output is that expression as a string. The test images came without labels.

<ol class="pipeline">
  <li><b>Clean</b> Validate annotations, fix out-of-bounds boxes, remove outliers and corrupted images</li>
  <li><b>Detect</b> Locate every character with YOLOv8 or Faster R-CNN</li>
  <li><b>Analyse</b> Cluster the detected characters (K-Means, DBSCAN, hierarchical) on HOG, CNN and statistical features to study the character set</li>
  <li><b>Recognise</b> Read the whole expression with a CRNN trained with CTC loss, with test-time augmentation at inference</li>
</ol>

## Detection

I trained two detectors on the character boxes. YOLOv8 reached 92.3% mAP and Faster R-CNN 89.7%, so YOLOv8 was both faster and more accurate on this data.

## Recognition: what worked and what didn't

My first approach was to classify characters one at a time: crop each detected symbol, train a classifier on the crops using the clustering results, then assemble the expression. It reached **4.08%** expression accuracy. Character alignment errors, too little real labelled data, and mistakes carried over from detection compounded at every stage, and one wrong symbol is enough to ruin an expression.

So I switched to reading the expression in one pass. The recogniser is a CRNN (a CNN feature extractor initialised from a pretrained ResNet-50, followed by a recurrent sequence model) trained with CTC loss. CTC learns the alignment between image columns and output characters by itself, so the model never needs to know where each character starts and ends. This raised expression accuracy to **54.35%**, with a mean edit distance of 0.83.

For stable training I used gradient clipping and `zero_infinity=True` in the CTC loss, which stops impossible alignments from producing infinite losses.

## Using the unlabelled test set

Because the test images were unlabelled, I also built a self-training loop. The supervised model predicts on the test images, and predictions above a confidence threshold (0.9–0.95) go back into training as pseudo-labels, weighted at 0.5 relative to real labels. I haven't yet measured this variant on held-out labelled data, so 54.35% is the result I report.

## What I'd try next

Beam-search decoding instead of greedy CTC decoding, an attention layer in the CRNN, grammar constraints so the model can't output invalid expressions, and synthetic training data.
