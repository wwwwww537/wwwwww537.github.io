---
lang: 'zh'
title: '使用 OpenCvSharp 在 C# 中进行二维码识别前的图像预处理'
status: 'COMPLETED'
category: 'AI视觉'
desc: '现场光线暗、条码脏污扫不出？利用 OpenCvSharp 在后端进行图像二值化和形态学处理，大幅提升解码率。'
tech: ['C#', 'OpenCV', '机器视觉']
pubDate: 2026-04-24
---

在仓储出入库节点，摄像头拍下来的条码经常存在反光、磨损或者对比度过低的问题。直接丢给 ZXing 解码库，识别率只有 60% 左右，导致现场工人频繁手动补录。

通过引入 `OpenCvSharp4`，我们在 C# 后端解码前加了一道预处理工序：

```csharp
using OpenCvSharp;

public Mat PreprocessBarcodeImage(string imagePath)
{
    // 1. 以灰度模式读取图片
    Mat src = Cv2.ImRead(imagePath, ImreadModes.Grayscale);
    Mat dst = new Mat();

    // 2. 高斯滤波，去除工业现场相机带来的白噪点
    Cv2.GaussianBlur(src, dst, new Size(5, 5), 0);

    // 3. 自适应二值化，应对局部光线不均（阴影问题）
    Cv2.AdaptiveThreshold(dst, dst, 255, 
                          AdaptiveThresholdTypes.GaussianC, 
                          ThresholdTypes.Binary, 11, 2);

    // 4. 形态学闭运算：填补条码上的断裂处或白色小孔
    Mat kernel = Cv2.GetStructuringElement(MorphShapes.Rect, new Size(3, 3));
    Cv2.MorphologyEx(dst, dst, MorphTypes.Close, kernel);

    return dst;
}
```

经过这一系列处理，原本模糊发灰的图像变成了清晰锐利的黑白图。再丢给解析库，识别率直接飙升到 98%。这就是后端掌握点传统图像处理算法的优势所在，不要什么都指望深度学习。