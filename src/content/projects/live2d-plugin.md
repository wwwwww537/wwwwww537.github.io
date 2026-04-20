---
lang: 'zh'
title: 'Live2D 交互插件'
status: 'ACTIVE'
category: 'Frontend Component'
desc: '为现代网页框架定制的看板娘组件，支持状态持久化。'
tech: ['Canvas API', 'JavaScript', 'CSS']
repoUrl: '[https://github.com/wwwwww537/live2d](https://github.com/wwwwww537/live2d)'
---

## > VISUAL_DEMONSTRATION
这个前端组件的核心在于对 Canvas 的极致优化。

*(你可以把预览图放在 public/images/ 目录下)*
![组件预览图](/images/live2d-demo.jpg)

## > HIGHLIGHTS
1. **极致轻量**：移除了不必要的 WebGL 依赖。
2. **状态保留**：利用 `sessionStorage`，刷新页面动作不中断。

## > LOGIC_FLOW
```text
[ User_Touch ] --(Event)--> [ Physics_Solver ]
                                   |
                                   v
[ Frame_Buffer ] <--(Draw)-- [ Vertex_Shader ]
```