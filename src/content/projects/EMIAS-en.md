---
lang: 'en'
title: 'EMIAS (Enhanced Medical Image Analysis System)'
status: 'COMPLETED'
category: 'Medical AI / Open Source Tool'
desc: 'An interactive segmentation tool based on ScribblePrompt that enables users to segment structures in medical images using scribbles, clicks, and bounding boxes.'
tech: ['Python', 'Gradio 5.20.0', 'PyTorch', 'SAM', 'UNet']
---

# EMIAS: Enhanced Medical Image Analysis System

> 🔗 **[Click here to view the associated Patent](/en/awards)**

## 🎥 Demonstration Video

<!-- Replace "demo-video.mp4" with the actual path or URL of your video -->
<video controls width="100%" poster="/images/EMIAS-封面.jpg">
  <source src="/files/EMIAS.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

## 📋 Overview

EMIAS (Enhanced Medical Image Analysis System) is an interactive segmentation tool based on ScribblePrompt. It enables medical professionals and researchers to segment complex structures in medical images seamlessly using intuitive inputs like scribbles, clicks, and bounding boxes. The project utilizes **Gradio (v5.20.0)** to provide a smooth, interactive web-based user interface.

## 🚀 Key Features

- **Interactive Labeling**: Fine-tune segmentation using manual scribbles, clicks, and bounding boxes.
- **Automatic Labeling**: Generate instant segmentations powered by pre-trained foundation models.
- **Multi-Model Support**: Easily switch between robust segmentation models (UNet, SAM, etc.).
- **Model Training**: Built-in support for fine-tuning and custom model training workflows.
- **Visual Interface**: An intuitive, web-based UI powered by Gradio.

## 🧠 Supported Models

1. **ScribblePrompt-UNet**: A fast and efficient UNet-based model optimized for interactive segmentation.
2. **ScribblePrompt-SAM**: A flexible segmentation backbone based on the Segment Anything Model (SAM).
3. **ESP-MedSAM**: An enhanced version of MedSAM fine-tuned specifically for medical image domains.

## 📖 Usage Instructions

1. **Upload**: Select from provided examples or upload your own medical scan.
2. **Select Model**: Choose a specific segmentation model from the dropdown list.
3. **Interact**: 
   - *Scribbles*: Draw positive (green) or negative (red) guidance markers.
   - *Clicks/Boxes*: Use clicks to create bounding boxes or point-based prompts.
4. **Automate**: Alternatively, use the auto-labeling feature for zero-shot masks.
5. **Refine**: Edit and finalize the generated masks in the "Output" editor.