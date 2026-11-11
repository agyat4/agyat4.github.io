---
title: Visual Token Pruning for Vision-Language Models
summary: Porting FEATHER-style visual token pruning to Qwen2.5-VL-7B, cutting the image tokens processed by the language model to about a quarter while preserving answer quality.
date: 2026-04-12
tags:
  - Vision-Language Models
  - Token Compression
  - Efficient Inference
url_code: https://github.com/agyat4/qwen-vl-research
image:
  caption: ''
---

Vision-language models turn every image into hundreds or thousands of visual tokens, and the language model has to attend over all of them at every layer. Many of these tokens carry little information for a given question. This project ports **FEATHER**, a visual-token pruning method originally written for LLaMA-based VLMs, to **Qwen2.5-VL-7B-Instruct**.

<!--more-->

## How it works

Pruning happens inside the language model's decoder loop, in two stages:

1. **Layer 3:** every visual token is scored by the attention it receives from the last text token, and the top 50% are kept. A uniform grid sample of tokens (stride 4) is kept as well, so regions of the image are never dropped entirely.
2. **Layer 8:** the surviving tokens are re-scored and halved again, leaving roughly 25% of the original visual tokens for the rest of the network.

Two details were needed to make this work on Qwen:

- **Scoring without RoPE.** Attention scores are computed from raw query/key projections without rotary position embeddings. Otherwise the position bias favors tokens near the end of the sequence, which unfairly penalizes the top of the image.
- **Recomputing position embeddings.** LLaMA applies RoPE inside each layer, so pruning position IDs is enough. Qwen2.5-VL precomputes its multimodal (3D) rotary embeddings once before the decoder loop, so the hidden states, 3D position IDs, attention masks and position embeddings all have to be pruned and recomputed together.

## Early results

On a small evaluation set of 9 image-question pairs covering localization, fine-grained recognition and scene description, the pruned model kept localization and recognition accuracy identical to the full model, answered slightly faster on average, and lost one question in the general-description category. A larger benchmark evaluation is the next step.
