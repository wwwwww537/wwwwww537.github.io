---
lang: 'en'
title: 'Generating Excel Templates with Dynamic Dropdowns using C# NPOI'
status: 'COMPLETED'
category: 'Backend'
desc: 'Mass uploading materials is common in MES. Learn how to generate Excel templates with hidden sheets and data validation using NPOI.'
tech: ['C#', 'NPOI', 'MES']
pubDate: 2026-04-24
---

When developing MES systems, users often request "Mass Upload" features, demanding that the downloaded template includes **dropdown menus** to prevent typos in enumerated values.

If options are dynamic (like factory areas) with many items, native API string length limits are easily exceeded. The best workaround: **Create a hidden sheet to store the data source, and have the main sheet reference this range via a formula.**

Core logic:

```csharp
// Core snippet: Create dropdown constraints and enable validation
public static void SetCellDropdownList(XSSFSheet sheet, int firstRow, int lastRow, int firstCol, int lastCol, string formula)
{
    var cellRegions = new CellRangeAddressList(firstRow, lastRow, firstCol, lastCol);
    XSSFDataValidationHelper helper = new XSSFDataValidationHelper(sheet);
    
    // Create constraint using formula (pointing to hidden sheet)
    var dropDownConstraint = (XSSFDataValidationConstraint)helper.CreateFormulaListConstraint(formula);
    
    IDataValidation dropDownValidation = helper.CreateValidation(dropDownConstraint, cellRegions);
    dropDownValidation.ShowPromptBox = true;
    dropDownValidation.CreateErrorBox("Invalid Input", "Please select a value from the dropdown.");
    dropDownValidation.ShowErrorBox = true;
    
    sheet.AddValidationData(dropDownValidation);
}
```

**Gotcha:** Make sure the `formula` string is perfect (e.g., `=hidden!$A$1:$A$100`). Remember to set the data sheet to `SheetState.VeryHidden` so users won't mess with it.