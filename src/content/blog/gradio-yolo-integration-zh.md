---
lang: 'zh'
title: '不到 50 行代码：用 Gradio 把 YOLOv8 打包成 MES 视觉 API'
status: 'COMPLETED'
category: 'AI视觉'
desc: '算法组丢给你一个 .pt 文件怎么落地？教你用 Python + Gradio 迅速起一个带前端 UI 且提供 REST API 的视觉服务。'
tech: ['Gradio', 'YOLO', 'Python']
pubDate: 2026-04-24
---

很多时候算法工程师只管把模型训练好，但在产线落地时，MES 开发人员根本不懂怎么跑模型。为了快速验证并集成，我最喜欢用 **Gradio**。

Gradio 不仅能秒建一个上传图片的 UI 测试界面，更绝的是它**自动提供 API 路由**。

```python
import gradio as gr
from ultralytics import YOLO
from PIL import Image

# 加载算法组的权重
model = YOLO("best_defect.pt")

def predict_defect(image):
    results = model(image)
    res_plotted = results[0].plot() # 渲染边框
    defect_count = len(results[0].boxes)
    
    return Image.fromarray(res_plotted), f"检测到 {defect_count} 处缺陷"

# 搭建界面
demo = gr.Interface(
    fn=predict_defect,
    inputs=gr.Image(type="pil", label="上传检测图片"),
    outputs=[gr.Image(type="pil", label="检测结果"), gr.Textbox(label="日志")],
    title="工业零件表面缺陷检测 API"
)

demo.launch(server_name="0.0.0.0", server_port=7860)
```

启动后，MES 后端直接 HTTP POST 访问 `http://127.0.0.1:7860/api/predict` 传 Base64 即可拿到结果，跨部门协作神器。