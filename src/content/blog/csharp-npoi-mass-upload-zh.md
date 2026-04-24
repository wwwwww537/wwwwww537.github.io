---
lang: 'zh'
title: '实战：使用 C# NPOI 动态生成带数据校验的下拉框 Excel 模板'
status: 'COMPLETED'
category: '后端开发'
desc: '在 MES 系统中批量导入数据是常见需求。本文分享如何使用 NPOI 动态生成带有隐藏 Sheet 和数据有效性（Data Validation）的 Excel 模板。'
tech: ['C#', 'NPOI', 'MES']
pubDate: 2026-04-24
---

在 MES 系统开发中，客户经常要求“批量上传数据”，而且要求下载的模板里必须有**下拉框**，以防填错数据字典里的枚举值。

如果下拉框选项少可以直接写死；但如果是动态数据（如工单状态、车间列表），选项一多原生 API 就会报错。最好的解决办法是：**建一个隐藏的 Sheet 存放数据源，主 Sheet 通过公式引用这个隐藏范围。**

核心实现逻辑：

```csharp
// 核心片段：创建下拉约束并开启校验
public static void SetCellDropdownList(XSSFSheet sheet, int firstRow, int lastRow, int firstCol, int lastCol, string formula)
{
    var cellRegions = new CellRangeAddressList(firstRow, lastRow, firstCol, lastCol);
    XSSFDataValidationHelper helper = new XSSFDataValidationHelper(sheet);
    
    // 使用公式创建约束 (指向隐藏的 Sheet)
    var dropDownConstraint = (XSSFDataValidationConstraint)helper.CreateFormulaListConstraint(formula);
    
    IDataValidation dropDownValidation = helper.CreateValidation(dropDownConstraint, cellRegions);
    dropDownValidation.ShowPromptBox = true;
    dropDownValidation.CreateErrorBox("输入不合法", "请输入下拉列表中的值。");
    dropDownValidation.ShowErrorBox = true;
    
    sheet.AddValidationData(dropDownValidation);
}

// 拼接隐藏列的范围引用公式
private static string getHiddenVerticalFormula(int cellIndex, int beginRowIndex, int endRowIndex)
{
    return "=hidden!$" + toLetterString(cellIndex) + "$" + beginRowIndex + ":$" + toLetterString(cellIndex) + "$" + endRowIndex;
}
```

**踩坑点**：`formula` 字符串格式通常是 `=隐藏Sheet名!$A$1:$A$100`。记得要把存数据的 Sheet 设置为 `SheetState.VeryHidden`，这样用户就找不到了。