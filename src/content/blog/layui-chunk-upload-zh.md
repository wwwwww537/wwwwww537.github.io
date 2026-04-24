---
lang: 'zh'
title: '工业级图纸上传：Layui 配合 C# 实现超大文件分片上传'
status: 'COMPLETED'
category: 'Web开发'
desc: '车间的 CAD 图纸和机床日志动辄几百兆。标准的 HTTP POST 上传容易超时崩溃。教你用 Layui 和 C# 实现分片上传与合并。'
tech: ['Layui', 'C#', '文件上传']
pubDate: 2026-04-24
---

在设备管理模块，维修人员经常需要上传硕大的机床日志压缩包或 CAD 图纸。如果直接一把梭哈上传，不仅占带宽，遇到车间弱网还容易中断，前功尽弃。最好的方案是：**前端切片，后端合并**。

前端基于 Layui，可以利用现成的插件或原生 FileReader 对象将大文件切成多个 2MB 的 Chunk 发送。而核心在于后端的 C# 处理逻辑：接收分片 -> 暂存临时文件 -> 收到合并指令后拼装。

```csharp
[HttpPost("UploadChunk")]
public async Task<IActionResult> UploadChunk(IFormFile file, string identifier, int chunkNumber)
{
    // 临时文件保存路径：按文件的唯一 identifier 命名文件夹
    string tempPath = Path.Combine("TempUploads", identifier);
    if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);

    // 保存当前切片
    string chunkPath = Path.Combine(tempPath, $"{chunkNumber}.part");
    using (var stream = new FileStream(chunkPath, FileMode.Create))
    {
        await file.CopyToAsync(stream);
    }
    return Ok();
}

[HttpPost("MergeFile")]
public IActionResult MergeFile(string identifier, string finalFileName, int totalChunks)
{
    string targetPath = Path.Combine("Uploads", finalFileName);
    using (var fs = new FileStream(targetPath, FileMode.Create))
    {
        for (int i = 1; i <= totalChunks; i++)
        {
            string chunkPath = Path.Combine("TempUploads", identifier, $"{i}.part");
            byte[] bytes = System.IO.File.ReadAllBytes(chunkPath);
            fs.Write(bytes, 0, bytes.Length);
            System.IO.File.Delete(chunkPath); // 写完立刻删掉临时切片
        }
    }
    return Ok(new { Path = targetPath });
}
```

实测 500MB 的文件在内网环境上传，分片后不但稳定，还能配合前端做平滑的进度条展示，体验极佳。