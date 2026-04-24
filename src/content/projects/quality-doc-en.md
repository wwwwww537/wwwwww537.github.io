---
lang: 'en'
title: 'Quality Document Management System'
status: 'COMPLETED'
category: 'Industrial Middleware'
desc: 'A digital office platform tailored for corporate quality management departments, aiming to replace traditional paper-based document circulation. It achieves full life-cycle management from drafting and three-level auditing to official release and obsolescence.'
tech: ['.NET Core', 'Layui', 'SQL Server']
---

## Project Overview
In traditional industrial quality management, controlled document issuance often relies on paper, leading to low efficiency and difficulty in auditing. This system establishes a secure digital archive to ensure all quality standards (SOP, WI) are strictly controlled.

## Core Features
### 1. Life-cycle Workflow
* **Drafting & Signing**: Supports cross-departmental collaborative signing with automatic revision tracking.
* **Audit System**: Implements a "Prepare-Review-Approve" hierarchy strictly following ISO standards.
* **Controlled Distribution**: Automatically pushes electronic versions to workshop terminals based on permission matrices.

### 2. Visualization Dashboard
* **Efficiency Monitoring**: Uses ECharts to track the average duration at each node to identify bottlenecks.
* **Usage Analytics**: Monitors document access frequency across departments.

## Technical Highlights
* **Security Sandbox**: Implements dynamic filtering based on metadata to prevent unauthorized downloads.
* **Audit Trail**: Every operation on controlled documents generates an immutable log snapshot.