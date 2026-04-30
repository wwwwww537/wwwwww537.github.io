---
lang: 'zh'
title: 'EMIAS (增强型医学图像分析系统)'
status: 'COMPLETED'
category: 'Medical AI / Open Source Tool'
desc: '一款基于 ScribblePrompt 的交互式医学图像分割工具，支持通过涂鸦、点击和边界框等交互方式实现医疗影像的精准分割。'
tech: ['Python', 'Gradio 5.20.0', 'PyTorch', 'SAM', 'UNet']
---

# EMIAS: 增强型医学图像分析系统

> 🔗 **[点击此处查看本项目相关专利详情](/zh/awards)**

## 🎥 演示视频

<!-- 请将 src 中的路径替换为您实际的视频路径或 URL，poster 可以替换为视频封面图 -->
<video controls width="100%" poster="/images/EMIAS-封面.jpg">
  <source src="/files/EMIAS.mp4" type="video/mp4" />
  您的浏览器不支持 HTML5 视频播放，请升级浏览器。
</video>

## 📋 项目概述

EMIAS (增强型医学图像分析系统) 是一款基于 ScribblePrompt 的交互式图像分割工具。它使医疗专业人员和研究者能够通过涂鸦、点击和边界框等直观的输入方式，无缝地对医学图像中的复杂结构进行分割。本项目采用 **Gradio (v5.20.0)** 构建了流畅的交互式网页用户界面。

## 🚀 核心特性

- **交互式标注**：使用手动涂鸦、点击和边界框进行分割结果的微调。
- **自动标注**：基于预训练的视觉基础模型，自动生成图像分割掩码。
- **多模型支持**：支持在多个强大的分割模型（如 UNet, SAM 等）之间无缝切换。
- **模型训练**：内置对模型微调和自定义训练工作流的支持。
- **可视化界面**：基于 Gradio 构建的直观的 Web 用户交互界面。

## 🧠 支持的模型

1. **ScribblePrompt-UNet**：一款快速高效的、针对交互式分割优化的类 UNet 模型。
2. **ScribblePrompt-SAM**：基于 Segment Anything Model (SAM) 的高灵活性分割骨干网络。
3. **ESP-MedSAM**：专为医学图像领域微调优化的增强版 MedSAM 模型。

## 📖 使用说明

1. **上传图像**：选择系统内置的示例，或上传您自己的医学影像。
2. **选择模型**：在下拉菜单中选择适合当前任务的分割模型。
3. **交互操作**：
   - *涂鸦 (Scribbles)*：绘制正向（绿色，保留）或负向（红色，排除）涂鸦引导。
   - *点击/边界框 (Clicks/Boxes)*：通过点击生成边界框或使用点提示（Point Prompts）。
4. **自动分割**：也可以直接点击自动标注，快速生成零样本（Zero-shot）掩码。
5. **细化调整**：在“输出 (Output)”编辑面板中查看并微调生成的掩码结果。