# MINI PROJECT REPORT

| **EX.NO:** 12 | **MINI PROJECT - Mall Customer Segmentation** |
| :--- | :--- |
| **DATE:** | |

---

### **Aim:**
To develop a machine learning-based **Mall Customer Segmentation System** that analyzes customer demographic and spending parameters to identify distinct behavioral groups, and integrates **Retrieval-Augmented Generation (RAG)** to provide actionable, contextual retail marketing strategies and promotion plans.

---

### **Define:**
The problem is to develop a machine learning application that uses customer-related parameters such as Age, Gender, Annual Income, and Spending Score to identify distinct customer segments and shopping personas. The system also utilizes Retrieval-Augmented Generation (RAG) to provide understandable, contextual marketing intelligence, personalized promotion recommendations, and retention strategies for retail store managers and marketing teams.

---

### **Problem Statement:**
> *"How might we develop a machine learning application that uses customer demographic and spending parameters to identify distinct behavioral segments and provide actionable marketing intelligence and personalized promotional recommendations to retail managers using Machine Learning and RAG?"*

---

### **Existing Problems:**
* **One-Size-Fits-All Marketing:** Blanket promotional campaigns fail to convert because different customer groups have vastly different purchasing capacities and priorities.
* **Complex Multi-Parameter Interpretation:** Manually correlating income, age, and spending habits across thousands of customer records is inefficient and error-prone.
* **Hidden High-Value Opportunities:** Without segmentation, retailers struggle to differentiate high-income cautious spenders from high-income luxury shoppers.
* **Lack of Contextual Explanations:** Traditional clustering models output cluster numbers (e.g., Cluster 0, Cluster 1) without providing business context or domain-specific promotional strategies.
* **Unpredictable Customer Lifetime Value (LTV):** Retailers cannot easily forecast which customer group yields the highest return on marketing investment.

---

### **Objective:**
1. Collect customer demographic and spending parameters from a benchmark dataset.
2. Preprocess and prepare the customer dataset (encoding gender, scaling features, checking distributions).
3. Train unsupervised machine learning clustering models (K-Means, Agglomerative Hierarchical, DBSCAN).
4. Determine the optimal number of clusters using the Elbow Method (WCSS) and Silhouette Score analysis.
5. Identify and label 5 distinct customer personas (VIP Elite, Trendsetters, Mainstream, Careful Spenders, Budget-Conscious).
6. Compare clustering algorithms using metrics like Silhouette Score, Davies-Bouldin Index, and Calinski-Harabasz Index.
7. Predict the customer segment for any new shopper profile in real-time.
8. Use RAG to retrieve relevant retail marketing, discount pricing, and customer retention strategies.
9. Provide AI-generated personalized promotional copy, channel suggestions, and campaign objectives.
10. Develop an interactive web application for dataset upload, clustering studio, prediction, and RAG advisory.

---

### **Empathy:**
The empathy phase focuses on understanding the difficulties faced by retail store managers, mall operators, and marketing teams when analyzing customer spending behavior and designing targeted discount campaigns.

#### **Problem Understanding:**
Shoppers visiting a shopping mall generate multiple data points, including their age, gender, annual income, and in-store spending frequency/score. It is difficult for store managers to manually determine which shoppers should receive luxury VIP concierge treatment versus who should receive budget coupons or Buy-Now-Pay-Later (BNPL) offers.

#### **User Needs:**
* A simple way to upload structured customer demographic and spending data (CSV/JSON).
* Automatic determination of the optimal number of customer clusters.
* Instant customer persona classification for new shoppers.
* Interactive 2D scatter plots showing Annual Income vs. Spending Score.
* Model performance metrics (Silhouette Score, Davies-Bouldin Index, Inertia).
* Clear explanations of customer behavioral traits for each cluster.
* Grounded retail marketing and promotional campaign recommendations using RAG.

---

### **Ideate:**
During the Ideate phase, possible solutions are considered and converted into a practical machine learning and RAG prototype:
1. Develop an unsupervised machine learning clustering model for customer segmentation.
2. Use a publicly available benchmark dataset (Kaggle Mall Customer Segmentation Data).
3. Allow users to upload custom CSV or Excel customer transaction datasets.
4. Apply automated data cleaning, missing value checks, and feature scaling.
5. Implement K-Means clustering with optimal $K$ detection via Elbow Method and Silhouette Coefficient.
6. Compare clustering algorithms: K-Means, Agglomerative/Hierarchical Clustering, and DBSCAN.
7. Map mathematical clusters to 5 business personas:
   - *Cluster 1:* Sensible / Budget-Conscious (Low Income, Low Spending)
   - *Cluster 2:* Careless / Trendsetters (Low Income, High Spending)
   - *Cluster 3:* Standard / Mainstream (Average Income, Average Spending)
   - *Cluster 4:* Careful / Potential High-Spenders (High Income, Low Spending)
   - *Cluster 5:* Target / VIP Elite (High Income, High Spending)
8. Develop a vector-indexed RAG knowledge base containing retail strategies, loyalty programs, luxury concierge perks, BNPL campaigns, and discount optimization.
9. Build an inference engine to classify individual customer inputs in real-time.
10. Connect RAG to synthesize grounded marketing campaigns for the predicted customer cluster.

---

### **Prototype:**
The proposed prototype is a **Mall Customer Segmentation & RAG Marketing Dashboard** developed using Python/TypeScript, Machine Learning, RAG, and a web-based frontend and backend.

The user uploads a customer dataset or uses the preloaded benchmark. The system profiles features, runs clustering algorithms, visualizes 2D scatter plots with centroid coordinates, evaluates separation metrics, predicts customer segments, and retrieves RAG marketing strategies.

1. **Dataset Upload & Profiling:** Allows the user to upload CSV/JSON files, inspect feature distributions, missing values, and demographic splits.
2. **Clustering Studio:** Interactive hyperparameter tuning ($K=2$ to $8$), Elbow Curve visualization, Silhouette score graph, and 2D scatter plot with color-coded clusters.
3. **Customer Segment Predictor:** Real-time form for entering Age, Gender, Annual Income, and Spending Score to classify the customer and calculate distance to cluster centroids.
4. **Model & RAG Marketing Insights:** Retrieves verified retail case studies from the vector knowledge base to output targeted campaign objectives, promotional offers, and conversion channels.

---

### **Code (Python Scikit-Learn Clustering Model):**

```python
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score

# 1. Load dataset
data = pd.read_csv("Mall_Customers.csv")

# 2. Select features for 2D Clustering
X = data[["Annual Income (k$)", "Spending Score (1-100)"]].values

# 3. Determine Optimal K using WCSS (Elbow Method)
wcss = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, init='k-means++', max_iter=300, n_init=10, random_state=42)
    kmeans.fit(X)
    wcss.append(kmeans.inertia_)

# 4. Train Optimal Model with K=5
optimal_k = 5
model = KMeans(n_clusters=optimal_k, init='k-means++', max_iter=300, n_init=10, random_state=42)
data['Cluster'] = model.fit_predict(X)

# 5. Model Evaluation
sil_score = silhouette_score(X, data['Cluster'])
db_score = davies_bouldin_score(X, data['Cluster'])
inertia = model.inertia_

print("Optimal Clusters (K):", optimal_k)
print("Silhouette Score:", round(sil_score, 4))
print("Davies-Bouldin Index:", round(db_score, 4))
print("Inertia (WCSS):", round(inertia, 2))
print("Cluster Centroids (Income, Spend):\n", model.cluster_centers_)

# 6. Predict for New Customer Instance (e.g. Income=$85k, Spend=80)
new_customer = np.array([[85, 80]])
predicted_cluster = model.predict(new_customer)[0]
print("New Customer Assigned Cluster:", predicted_cluster)
```

---

### **Important Notes:**
* **Unsupervised Clustering:** The application does not require pre-labeled target classes; it discovers natural patterns directly from customer spending and income distributions.
* **Separation of Concerns:** 
  * **Machine Learning Model** = Performs mathematical grouping and calculates centroid distances.
  * **RAG Component** = Explains the customer segment and provides grounded, actionable retail marketing strategies.
* **Truthful Evaluation:** Do not invent cluster metrics; only display empirical Silhouette Scores ($0.554$) and Inertia values ($44,448$) obtained from model fitting.

---

### **Dataset:**
* **Primary Demonstration Dataset:** Mall Customer Segmentation Data
* **Source:** Kaggle (`https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python`)
* **Description:** Contains 200 customer records from a shopping mall membership database.
* **Features:**
  1. `CustomerID`: Unique numerical identifier for each customer.
  2. `Gender`: Categorical feature (`Male` / `Female`).
  3. `Age`: Numerical feature representing customer age (range: 18 – 70 years).
  4. `Annual Income (k$)`: Annual income of the customer in thousands of dollars (range: \$15k – \$137k).
  5. `Spending Score (1-100)`: Score assigned by the mall based on customer behavior and spending nature (range: 1 – 99).

---

### **RAG Requirement:**
The project **MUST use RAG**. The knowledge base contains specialized research on retail marketing, customer retention, luxury VIP concierge management, Buy-Now-Pay-Later (BNPL) schemes, family weekend promotions, and seasonal clearance strategies.

$$\text{User / Shopper Input} \longrightarrow \text{ML Clustering Model} \longrightarrow \text{Cluster Persona ID} \longrightarrow \text{Retrieve Relevant Retail Knowledge} \longrightarrow \text{RAG Context Injection} \longrightarrow \text{AI-Generated Marketing Strategy}$$

> **Note:** RAG does NOT replace the clustering model. The ML model determines the mathematical cluster assignment, while RAG provides supporting business context and actionable promotion roadmaps.

---

### **Dataset Upload Requirement:**
1. Read the uploaded customer dataset (CSV or JSON format).
2. Display the total number of customer records and feature count.
3. Display summary statistics (mean, min, max, standard deviation) for Income, Age, and Spending Score.
4. Identify numerical and categorical features.
5. Handle missing values and duplicate records automatically.
6. Compute the Elbow Curve (WCSS vs. $K$) to verify optimal cluster count.
7. Compute Silhouette Scores across different $K$ values.
8. Train K-Means, Agglomerative Hierarchical, and DBSCAN algorithms.
9. Render interactive 2D scatter plots with color-coded clusters and centroid markers.
10. Allow single-record customer segment prediction.
11. Compute Euclidean distance from the input customer to all cluster centroids.
12. Display demographic breakdowns (Gender ratio, average age per cluster).
13. Send the predicted cluster persona context to the RAG pipeline.
14. Retrieve top-3 vector knowledge chunks matching the customer profile.
15. Display the synthesized marketing campaign, promotional offers, and expected KPIs.

---

### **App Architecture & Dashboard Interface:**
* **Overview Dashboard:** Executive summary featuring hero banner, KPI metric cards (Total Customers: 200, Optimal $K=5$, Silhouette Score: 0.554, VIP Ratio: 19.5%), interactive scatter chart, and segment distribution pie chart.
* **Dataset Profile:** Ingestion table with search/filtering, numerical distributions, demographic splits, and custom CSV/JSON upload.
* **Clustering Studio:** Algorithm selection (K-Means, Agglomerative, DBSCAN), interactive $K$-slider, Elbow Method plot, Silhouette coefficient comparison, and centroid coordinates.
* **Customer Segment Predictor:** Live simulation form to enter Age, Gender, Income, and Spending Score with instant cluster assignment and centroid proximity ranking.
* **Customer Personas Hub:** Deep-dive strategic playbooks for all 5 customer groups (VIP Elite, Trendsetters, Mainstream, Careful Spenders, Budget-Conscious).
* **RAG Marketing AI Assistant:** Semantic knowledge search engine with retrieved evidence cards, relevance scoring, and structured multi-step campaign synthesis.
* **Model Registry:** Governance table comparing Silhouette Scores, Davies-Bouldin indices, Calinski-Harabasz scores, and execution runtimes.

---

### **Result:**
The **Mall Customer Segmentation System** was successfully developed using Machine Learning and Retrieval-Augmented Generation (RAG). The system ingests customer transaction data, preprocesses demographic and spending parameters, trains unsupervised clustering algorithms ($K=5$, Silhouette Score = $0.554$, Inertia = $44,448$), and segments shoppers into 5 distinct behavioral personas. The RAG component retrieves domain-specific retail knowledge to synthesize high-ROI promotional campaigns, personalized discount offers, and retention playbooks.

The application delivers:
* In-depth dataset profiling and missing value validation.
* Real-time customer segment prediction and centroid distance analysis.
* Interactive 2D scatter visualizations with dynamic cluster highlights.
* Model comparison across K-Means, Hierarchical Clustering, and DBSCAN.
* RAG-grounded marketing campaign generation and customer lifetime value optimization.
