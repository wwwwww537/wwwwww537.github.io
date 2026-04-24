---
lang: 'en'
title: 'Industrial File Uploads: Chunking Large Files with Layui and C#'
status: 'COMPLETED'
category: 'Web Dev'
desc: 'Workshop CAD drawings and logs can be huge. Standard HTTP POSTs fail easily. Learn to implement chunked uploads and merges.'
tech: ['Layui', 'C#', 'Upload']
pubDate: 2026-04-24
---

In the equipment management module, technicians often upload massive log archives or CAD drawings. A monolithic upload hogs bandwidth and drops on weak workshop networks. The best solution: **Frontend slicing, Backend merging**.

The frontend, based on Layui, can use the native `FileReader` API to slice the file into 2MB chunks. However, the C# backend logic is the true core: Receive chunks -> Store temporarily -> Assemble upon receiving the merge command.

```csharp
[HttpPost("UploadChunk")]
public async Task<IActionResult> UploadChunk(IFormFile file, string identifier, int chunkNumber)
{
    // Temp path based on unique file identifier
    string tempPath = Path.Combine("TempUploads", identifier);
    if (!Directory.Exists(tempPath)) Directory.CreateDirectory(tempPath);

    // Save current chunk
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
            System.IO.File.Delete(chunkPath); // Clean up temp chunk immediately
        }
    }
    return Ok(new { Path = targetPath });
}
```

Tested with a 500MB file on an intranet, chunking is not only stable but allows for a smooth progress bar experience on the frontend.