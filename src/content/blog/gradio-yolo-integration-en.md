---
lang: 'en'
title: 'Turning YOLOv8 into an MES-Ready API with Gradio'
status: 'COMPLETED'
category: 'AI Vision'
desc: 'Algorithm team handed you a .pt file? Learn to use Python and Gradio to quickly spin up a vision service with a UI and a REST API.'
tech: ['Gradio', 'YOLO', 'Python']
pubDate: 2026-04-24
---

Algorithm engineers train models, but MES developers (C#/Java) often don't know how to run them in production. For rapid integration, my go-to tool is **Gradio**.

Gradio not only builds a UI for image uploading in seconds, but it also **automatically exposes an API route**.

```python
import gradio as gr
from ultralytics import YOLO
from PIL import Image

model = YOLO("best_defect.pt")

def predict_defect(image):
    results = model(image)
    res_plotted = results[0].plot() # Render bounding boxes
    defect_count = len(results[0].boxes)
    
    return Image.fromarray(res_plotted), f"Found {defect_count} defects."

# Build the Interface
demo = gr.Interface(
    fn=predict_defect,
    inputs=gr.Image(type="pil", label="Upload Image"),
    outputs=[gr.Image(type="pil"), gr.Textbox(label="Log")],
    title="Industrial Defect Detection API"
)

demo.launch(server_name="0.0.0.0", server_port=7860)
```

Once launched, the MES backend executes an HTTP POST to `http://127.0.0.1:7860/api/predict` with a base64 string to get the results. It's the ultimate tool for cross-departmental collaboration.