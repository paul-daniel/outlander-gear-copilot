# Outlander Gear Co. — AI Copilot Project Submission

## Project Overview

**Outlander Gear Co.** is an outdoor equipment e-commerce platform featuring **GuideLander**, an AI-powered shopping assistant built with Azure AI Foundry, PromptFlow, and a RAG (Retrieval-Augmented Generation) pipeline. The assistant helps customers compare products, get recommendations, and find answers about shipping, returns, and product care — all grounded in real catalog data.

---

## Demo Videos

https://github.com/user-attachments/assets/110e0119-6736-481e-9f60-8f68370ef1b8
https://github.com/user-attachments/assets/b0b37cca-c473-4c80-8088-a5042f8e438b


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
