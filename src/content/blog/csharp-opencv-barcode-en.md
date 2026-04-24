---
lang: 'en'
title: 'Barcode Image Preprocessing in C# using OpenCvSharp'
status: 'COMPLETED'
category: 'AI Vision'
desc: 'Poor lighting or dirty barcodes causing scan failures? Use OpenCvSharp for binarization and morphological processing to boost read rates.'
tech: ['C#', 'OpenCV', 'Machine Vision']
pubDate: 2026-04-24
---

At warehouse entry/exit nodes, barcodes captured by cameras are often reflective, worn, or have low contrast. Feeding these directly to decoding libraries like ZXing yields a mere 60% success rate, forcing workers to manually input data.

By introducing `OpenCvSharp4`, we added a preprocessing step in the C# backend before decoding:

```csharp
using OpenCvSharp;

public Mat PreprocessBarcodeImage(string imagePath)
{
    // 1. Read image in grayscale
    Mat src = Cv2.ImRead(imagePath, ImreadModes.Grayscale);
    Mat dst = new Mat();

    // 2. Gaussian Blur to remove industrial camera noise
    Cv2.GaussianBlur(src, dst, new Size(5, 5), 0);

    // 3. Adaptive Thresholding to handle uneven lighting (shadows)
    Cv2.AdaptiveThreshold(dst, dst, 255, 
                          AdaptiveThresholdTypes.GaussianC, 
                          ThresholdTypes.Binary, 11, 2);

    // 4. Morphological Close to fill in gaps or white holes on barcodes
    Mat kernel = Cv2.GetStructuringElement(MorphShapes.Rect, new Size(3, 3));
    Cv2.MorphologyEx(dst, dst, MorphTypes.Close, kernel);

    return dst;
}
```

After this processing, a blurry, grayish image becomes a sharp black-and-white graphic. Passed to the barcode parser again, the recognition rate skyrockets to 98%. This highlights the power of knowing traditional image processing algorithms on the backend.