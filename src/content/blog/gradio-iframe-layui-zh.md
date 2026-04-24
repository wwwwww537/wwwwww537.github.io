---
lang: 'zh'
title: '大一统：将 Python Gradio 应用无缝内嵌到 Layui 管理系统中'
status: 'COMPLETED'
category: 'Web开发'
desc: '企业项目里不可能让用户跳出去看独立的 Gradio 页面。本文探讨通过 Iframe 嵌套消除样式隔离的实战经验。'
tech: ['Gradio', 'Layui', 'Iframe']
pubDate: 2026-04-24
---

Gradio 的独立页面确实很酷，但在交付企业级 MES 时，客户要求把“AI 质检看板”放到统一的 Layui 菜单列表里，绝对不能打开新标签页。

最简单的方法就是 `<iframe>`。但直接嵌进去会有一个致命问题：Gradio 默认带了一个深浅色切换的 Header，还有多余的 Padding 外边距，放在 Layui 的 Content 区域里显得极其格格不入。

**破局方法：使用 Gradio 的 `css` 参数覆盖全局样式**

在 Gradio 的 Python 启动脚本里注入 CSS 魔改：

```python
import gradio as gr

# 隐藏顶栏、页脚，去除白边
custom_css = """
footer {display: none !important;}
.gradio-container {margin: 0 !important; padding: 0 !important; max-width: 100% !important;}
#component-0 {border: none !important; box-shadow: none !important;}
"""

demo = gr.Interface(
    fn=my_function,
    inputs="image",
    outputs="text",
    css=custom_css  # 注入魔改 CSS
)

demo.launch()
```

接着在你的 Layui 页面中：
```html
<div class="layui-body" style="overflow: hidden;">
    <iframe src="http://localhost:7860/" style="width: 100%; height: 100%; border: none;"></iframe>
</div>
```

这样一搞，前端用户完全感觉不到里面跑的是一个基于 Python 的独立框架，实现了完美的视觉融合。