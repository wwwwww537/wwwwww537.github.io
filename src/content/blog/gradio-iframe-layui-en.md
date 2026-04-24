---
lang: 'en'
title: 'The Grand Unification: Embedding Gradio into a Layui Dashboard'
status: 'COMPLETED'
category: 'Web Dev'
desc: 'Corporate users won"t accept bouncing to a standalone Gradio page. Learn how to embed it seamlessly via Iframe, solving style isolation.'
tech: ['Gradio', 'Layui', 'Iframe']
pubDate: 2026-04-24
---

Gradio's standalone pages are cool, but when delivering enterprise MES, clients demand the "AI Inspection Dashboard" be inside the unified Layui menu. No popups or new tabs allowed.

The simplest method is `<iframe>`. However, embedding it directly causes a fatal flaw: Gradio includes a default header and excessive padding, making it look incredibly out of place within a Layui Content area.

**The Fix: Use Gradio's `css` parameter for global overrides.**

Inject CSS in your Python launch script:

```python
import gradio as gr

# Hide header, footer, and remove margins
custom_css = """
footer {display: none !important;}
.gradio-container {margin: 0 !important; padding: 0 !important; max-width: 100% !important;}
#component-0 {border: none !important; box-shadow: none !important;}
"""

demo = gr.Interface(
    fn=my_function,
    inputs="image",
    outputs="text",
    css=custom_css  # Inject the hacked CSS
)

demo.launch()
```

Then in your Layui page:
```html
<div class="layui-body" style="overflow: hidden;">
    <iframe src="http://localhost:7860/" style="width: 100%; height: 100%; border: none;"></iframe>
</div>
```

With this, frontend users are completely unaware they are using a standalone Python-based framework. It achieves perfect visual harmony.