---
title: SemanticFrameSearch
summary: A local, open-source pipeline for finding the right frames in videos using natural-language queries, combining vision-language retrieval with caption-based reranking.
date: 2026-09-27
tags:
  - Computer Vision
  - Multimodal Retrieval
  - Video
url_code: https://github.com/agyat4/semantic-frame-search
image:
  caption: ''
---

Collecting clean images of specific objects from video, for example robotics and lab components from YouTube tutorials, usually means scrubbing through hours of footage by hand. SemanticFrameSearch automates this: give it a list of videos and a description of what you are looking for, and it returns the best-matching frames with timestamps and scores.

<!--more-->

The first use case is building image collections of robotics and laboratory parts, but the system is designed to stay domain-independent.

## Pipeline

1. **Sample** frames from each video.
2. **Retrieve** candidates by embedding frames and the text query with SigLIP and ranking by image-text similarity.
3. **Caption** the top candidates with an image-captioning model.
4. **Rerank** by comparing each caption to the original query with a sentence-embedding model, then combining the visual and caption scores.
5. **Export** the ranked frames with their source video, timestamp and all intermediate scores.

## Status

Work in progress. Frame retrieval and caption-based reranking are implemented. Planned next steps are SigLIP2 retrieval, Florence-2 captions, denser search around promising time ranges, duplicate removal and original-resolution frame extraction.
