# Outlander Gear Co. — AI Copilot Project Submission

## Project Overview

**Outlander Gear Co.** is an outdoor equipment e-commerce platform featuring **GuideLander**, an AI-powered shopping assistant built with Azure AI Foundry, PromptFlow, and a RAG (Retrieval-Augmented Generation) pipeline. The assistant helps customers compare products, get recommendations, and find answers about shipping, returns, and product care — all grounded in real catalog data.

---

## Demo Videos

<!-- 
  HOW TO EMBED GOOGLE DRIVE VIDEOS
  ─────────────────────────────────
  1. Open your video in Google Drive
  2. Click ⋮ → Share → Change to "Anyone with the link"
  3. Copy the file ID from the share URL:
     https://drive.google.com/file/d/<FILE_ID>/view
  4. Replace YOUR_FILE_ID below with that ID

  Note: Markdown doesn't support <iframe> on GitHub/most renderers.
  The approach below provides a clickable thumbnail that opens the video.
-->

### Full Demo Walkthrough
[![Watch the demo 1](https://drive.google.com/file/d/1wkD0fRiMGZ094KB41MZ55JPgyxhKY8Ti/view?usp=sharing)

### AI Copilot Interaction Demo
[![Watch the demo 2](https://drive.google.com/file/d/1NJoM4BIu9RvTp_a-HNSocLr7EWKfgwLa/view?usp=sharing)

---

## Submission Checklist

| # | Requirement | Status | Location |
|---|-------------|--------|----------|
| 1 | Evaluation report with screenshots or exported metrics | ✅ | [`evaluation_report/`](evaluation_report/) |
| 2 | Deployment confirmation screenshot | ✅ | [`deployment_confirmation/`](deployment_confirmation/) |
| 3 | Sample interaction logs or screenshots showcasing various questions and responses | ✅ | [`interactions_with_copilot/`](interactions_with_copilot/) |
| 4 | Visual/screenshots of the Prompt Flow setup | ✅ | [`prompflow_setup/`](prompflow_setup/) |
| 5 | JSONL or CSV file of the evaluation dataset | ✅ | [`evaluation_set/sample.jsonl`](evaluation_set/sample.jsonl) |

---

## Folder Structure

```
UDACITY PROJECT SUBMISSION/
├── README.md                          ← You are here
├── deployment_confirmation/
│   ├── screenshot1.png                # Azure endpoint deployment confirmation
│   └── screenshot2.png
├── evaluation_report/
│   ├── evaluation_metrics.png         # Evaluation metrics summary
│   ├── evaluation_metrics_detailed.png
│   └── *.csv                          # Exported evaluation output tables
├── evaluation_set/
│   └── sample.jsonl                   # 16 test queries with ground truth & context
├── interactions_with_copilot/
│   ├── screen1.png                    # Sample Q&A interactions
│   ├── screen2.png
│   ├── screen3.png
│   ├── screen4.png
│   └── screen5.png
└── prompflow_setup/
    ├── screen1.png                    # PromptFlow DAG and configuration
    ├── screen2.png
    ├── screen3.png
    ├── screen4.png
    └── screen5.png
```

---

## Evaluation Dataset

The evaluation dataset ([`evaluation_set/sample.jsonl`](evaluation_set/sample.jsonl)) contains **16 test queries** across 7 categories:

- **Direct comparisons** — table-based product comparisons grounded in catalog data
- **Fuzzy/invented names** — tests auto-mapping of non-exact product names
- **Open-ended recommendations** — scenario-based advice (beginner, travel, one-pack)
- **Cross-domain queries** — mixing product info with policy (returns, shipping)
- **Missing data fields** — requests for specs not in the indexed data
- **Competitor/out-of-scope** — guardrail enforcement for off-topic questions
- **Short-form requests** — abbreviation handling and concise response formatting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Tailwind CSS, Transloco i18n |
| Backend | Node.js, Express, TypeScript, PostgreSQL |
| AI/ML | Azure AI Foundry, GPT-4o, PromptFlow |
| RAG | Azure AI Search, text-embedding-3-large |
| Deployment | Azure ML Managed Endpoint |
