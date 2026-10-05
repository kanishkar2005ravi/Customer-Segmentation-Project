# Mall Customer Segmentation & RAG Marketing Intelligence System

An end-to-end Machine Learning and Retrieval-Augmented Generation (RAG) platform that identifies distinct customer spending personas using unsupervised clustering algorithms (K-Means, Agglomerative Hierarchical, DBSCAN) and synthesizes personalized promotional campaigns and retention playbooks.

## 🚀 Features
- **Dataset Profiling:** Ingestion and statistical analysis of customer demographic and spending data.
- **Clustering Studio:** Interactive tuning for $K=2$ to $8$, Elbow Method (WCSS curve), and Silhouette Score validation.
- **5 Canonical Customer Personas:**
  1. *Sensible / Budget-Conscious* (Low Income, Low Spending)
  2. *Careless / Trendsetters* (Low Income, High Spending)
  3. *Standard / Mainstream* (Average Income, Average Spending)
  4. *Careful / Potential High-Spenders* (High Income, Low Spending)
  5. *Target / VIP Elite* (High Income, High Spending)
- **Real-Time Customer Segment Predictor:** Live simulation form to classify incoming shoppers by Age, Gender, Income, and Spending Score with centroid proximity ranking.
- **RAG Marketing AI Assistant:** Vector-grounded retail knowledge retrieval to formulate multi-channel marketing campaigns.
- **Model Registry & Governance:** Quantitative benchmark table comparing Silhouette Scores, Davies-Bouldin indices, and Calinski-Harabasz scores.

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React, Recharts
- **Build Tool:** Vite 6
- **Deployment:** Vercel

## 📦 Local Setup & Run

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📄 Project Documentation
- **Report (Markdown):** `MALL_CUSTOMER_SEGMENTATION_REPORT.md`
- **Report (A4 PDF):** `MALL_CUSTOMER_SEGMENTATION_REPORT.pdf`
- **Printable HTML:** `report_a4.html`
