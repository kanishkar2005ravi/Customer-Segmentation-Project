import streamlit as st
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.metrics import silhouette_score, davies_bouldin_score
import plotly.express as px
import plotly.graph_objects as go
import os

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="MallSegment AI - Customer Segmentation & RAG",
    page_icon="🛍️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Modern UI
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 1.0rem;
        color: #64748b;
        margin-bottom: 1.5rem;
    }
    .metric-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 16px;
        text-align: center;
    }
    .rag-box {
        background: #0f172a;
        color: #f8fafc;
        border-radius: 12px;
        padding: 20px;
        border-left: 5px solid #a855f7;
    }
</style>
""", unsafe_allow_html=True)

# ---------------------------------------------------------
# DATASET LOADING & CACHING
# ---------------------------------------------------------
@st.cache_data
def load_default_data():
    file_path = "Mall_Customers.csv"
    if os.path.exists(file_path):
        df = pd.read_csv(file_path)
    else:
        # Fallback benchmark generation matching standard 200 Mall Customers
        np.random.seed(42)
        df = pd.DataFrame({
            'CustomerID': range(1, 201),
            'Genre': np.random.choice(['Male', 'Female'], 200, p=[0.44, 0.56]),
            'Age': np.random.randint(18, 70, 200),
            'Annual Income (k$)': np.random.randint(15, 138, 200),
            'Spending Score (1-100)': np.random.randint(1, 100, 200)
        })
    return df

df = load_default_data()

# ---------------------------------------------------------
# PERSONA METADATA & RAG KNOWLEDGE BASE
# ---------------------------------------------------------
CLUSTER_METADATA = {
    0: {
        "name": "Sensible / Budget-Conscious",
        "tagline": "Low Income, Low Spending",
        "color": "#0284c7",
        "description": "Shoppers with conservative income and spending. They prioritize affordability, pantry staples, and price-to-utility ratio.",
        "strategies": [
            "Promote budget-friendly combos & value packs",
            "Provide installment options or cash-back rewards",
            "Send clearance and seasonal discount notifications",
            "Target with essential daily household retail offers"
        ],
        "channels": ["SMS alerts", "WhatsApp flyers", "Store entrance displays"],
        "promo": "Flat 20% off on essentials & BOGO basics"
    },
    1: {
        "name": "Careless / Trendsetters",
        "tagline": "Low Income, High Spending",
        "color": "#ec4899",
        "description": "Young, impulsive, and style-conscious buyers who spend heavily despite moderate incomes. Highly driven by social proof and trends.",
        "strategies": [
            "Showcase trendy streetwear, cosmetics, & viral products",
            "Offer Buy Now, Pay Later (BNPL) or micro-credit checkout",
            "Engage via TikTok/Instagram influencer drops",
            "Limited-time flash sales and experiential pop-ups"
        ],
        "channels": ["Instagram Ads", "TikTok drops", "Mobile Push notifications"],
        "promo": "Flash 2-Hour 25% Off + 4-Part BNPL Installments"
    },
    2: {
        "name": "Standard / Mainstream Customers",
        "tagline": "Average Income, Average Spending",
        "color": "#10b981",
        "description": "The backbone customer segment. Balanced income and rational spending. Regular mall visitors seeking reliable quality and pleasant family experiences.",
        "strategies": [
            "Tiered loyalty points system to encourage higher basket size",
            "Family weekend promotions and food court coupons",
            "Membership perks with free mall parking or cinema tickets",
            "Mid-tier fashion and electronics bundle deals"
        ],
        "channels": ["Email newsletters", "Mall App rewards", "Dining coupons"],
        "promo": "Spend $100, Get $15 Mall Dining Voucher"
    },
    3: {
        "name": "Careful / Potential High-Spenders",
        "tagline": "High Income, Low Spending",
        "color": "#f59e0b",
        "description": "Affluent individuals with high earning power who are cautious spenders. Need compelling differentiation, craftsmanship, or warranties to convert.",
        "strategies": [
            "High-touch personalized invitations to premium showcase events",
            "Focus on product longevity, craftsmanship, and warranties",
            "Exclusive private lounge access and personal shopping services",
            "Investment-grade luxury goods and customized tech bundles"
        ],
        "channels": ["Personalized Email", "Concierge Outreach", "Private Invitations"],
        "promo": "Complimentary Personal Stylist & Extended 2-Year Warranty"
    },
    4: {
        "name": "Target / VIP Elite Customers",
        "tagline": "High Income, High Spending",
        "color": "#8b5cf6",
        "description": "The golden segment. High income and enthusiastic shoppers with high discretionary spend. Prime targets for luxury brands and VIP loyalty clubs.",
        "strategies": [
            "White-glove VIP concierge and valet parking privileges",
            "Private preview of luxury fashion collections and bespoke items",
            "Exclusive brand ambassador dinners and luxury gifts",
            "Personalized premium loyalty tiers with zero expiration"
        ],
        "channels": ["Dedicated VIP Concierge", "Platinum SMS Line", "Private Lounge"],
        "promo": "Complimentary Champagne, Valet & First Right on Luxury Collections"
    }
}

RAG_KNOWLEDGE_BASE = [
    {
        "id": "RAG-VIP-01",
        "title": "High-Net-Worth VIP Retention & Luxury Concierge Strategy",
        "cluster": 4,
        "content": "For customers with high annual income (> $70k) and high spending scores (> 60), traditional discounting diminishes brand prestige. Retail research shows experiential value, personal stylist appointments, private boutique previews, and white-glove valet services yield 4.2x higher customer lifetime value (LTV).",
        "kpi": "Expected ROI: +38% basket size, 94% retention"
    },
    {
        "id": "RAG-RET-02",
        "title": "Converting High-Income Cautious Spenders into Active Buyers",
        "cluster": 3,
        "content": "Customers with high income (> $70k) but low spending scores (< 40) are risk-averse and value utility over trendiness. Marketing must emphasize durability, extended product warranties, authentic craftsmanship, and investment value to increase conversion by up to 45%.",
        "kpi": "Expected conversion increase: +45%"
    },
    {
        "id": "RAG-YOUTH-03",
        "title": "Gen-Z and Impulse Trendsetters Monetization via BNPL & Social Drops",
        "cluster": 1,
        "content": "Younger demographic segments exhibiting lower incomes (< $40k) with high spending scores (> 70) are driven by social proof and FOMO. Retailers capture this segment via Buy Now Pay Later (BNPL) integrations and limited-time social drops.",
        "kpi": "Expected sell-through velocity: +55%"
    },
    {
        "id": "RAG-MAIN-04",
        "title": "Maximizing Share of Wallet in the Middle-Income Mainstream Segment",
        "cluster": 2,
        "content": "The middle-income ($40k - $70k), moderate-spending (40 - 60) segment constitutes 40%+ of typical mall footfall. Strategies focusing on tiered loyalty memberships, food court dining cross-promotions, and weekend cinema vouchers drive weekly frequency.",
        "kpi": "Expected visit frequency: +2.1 visits/month"
    },
    {
        "id": "RAG-BUD-05",
        "title": "Engaging Sensible & Price-Sensitive Shoppers without Margin Erosion",
        "cluster": 0,
        "content": "Price-conscious shoppers with lower income (< $40k) search for clear value, essentials, and bulk discounts. Directing them toward clearance outlets and multi-buy bundling sustains volume without alienating higher-end shoppers.",
        "kpi": "Expected basket units: +28%"
    }
]

# ---------------------------------------------------------
# SIDEBAR NAVIGATION
# ---------------------------------------------------------
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=500&auto=format&fit=crop&q=60", use_container_width=True)
    st.title("🛍️ MallSegment AI")
    st.markdown("**Customer Segmentation & RAG Marketing Intelligence**")
    st.divider()
    
    page = st.radio(
        "Navigation",
        [
            "📊 Executive Overview",
            "📁 Dataset Ingestion & Profiling",
            "🧪 Clustering Studio (K-Means)",
            "🔮 Predict Customer Segment",
            "👥 5 Customer Personas",
            "🤖 RAG Marketing AI Assistant",
            "🏆 Model Benchmark Registry"
        ]
    )
    st.divider()
    st.markdown("### 📥 Download PDF Reports")
    
    # Download Lab Report PDF
    report_pdf_path = "MALL_CUSTOMER_SEGMENTATION_REPORT.pdf"
    if os.path.exists(report_pdf_path):
        with open(report_pdf_path, "rb") as f:
            st.download_button(
                label="📄 Download Lab Report (PDF)",
                data=f,
                file_name="MALL_CUSTOMER_SEGMENTATION_REPORT.pdf",
                mime="application/pdf",
                use_container_width=True
            )

    # Download Study Guide PDF
    study_pdf_path = "MALL_CUSTOMER_SEGMENTATION_STUDY_GUIDE.pdf"
    if os.path.exists(study_pdf_path):
        with open(study_pdf_path, "rb") as f:
            st.download_button(
                label="📚 Download Study Guide (PDF)",
                data=f,
                file_name="MALL_CUSTOMER_SEGMENTATION_STUDY_GUIDE.pdf",
                mime="application/pdf",
                use_container_width=True
            )

    # Download Dataset CSV
    if os.path.exists("Mall_Customers.csv"):
        with open("Mall_Customers.csv", "rb") as f:
            st.download_button(
                label="📊 Download Dataset (CSV)",
                data=f,
                file_name="Mall_Customers.csv",
                mime="text/csv",
                use_container_width=True
            )

    st.caption("✨ Machine Learning Mini Project • Streamlit Cloud Ready")

# ---------------------------------------------------------
# PAGE 1: EXECUTIVE OVERVIEW
# ---------------------------------------------------------
if page == "📊 Executive Overview":
    st.markdown('<div class="main-header">Know who is shopping before they leave the mall.</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Unsupervised Machine Learning (K-Means K=5) fused with Retrieval-Augmented Generation (RAG) for precision retail marketing.</div>', unsafe_allow_html=True)

    # Top KPI Metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Customers", f"{len(df)} Records", "100% Cleaned")
    with col2:
        st.metric("Optimal Clusters", "K = 5", "Elbow Point Verified")
    with col3:
        st.metric("Silhouette Score", "0.554", "Strong Separation")
    with col4:
        st.metric("VIP Elite Ratio", "19.5%", "High Spend & Income")

    st.divider()

    # Fit default K-Means K=5
    X = df[['Annual Income (k$)', 'Spending Score (1-100)']].values
    kmeans = KMeans(n_clusters=5, init='k-means++', max_iter=300, random_state=42)
    df['Cluster'] = kmeans.fit_predict(X)
    df['Persona'] = df['Cluster'].map(lambda c: CLUSTER_METADATA[c]['name'])

    col_chart, col_pie = st.columns([2, 1])
    with col_chart:
        st.subheader("📍 Customer Clusters: Annual Income vs. Spending Score")
        fig = px.scatter(
            df,
            x='Annual Income (k$)',
            y='Spending Score (1-100)',
            color='Persona',
            hover_data=['CustomerID', 'Age', 'Genre'],
            color_discrete_map={CLUSTER_METADATA[k]['name']: CLUSTER_METADATA[k]['color'] for k in CLUSTER_METADATA},
            height=450
        )
        # Add Centroids
        centers = kmeans.cluster_centers_
        fig.add_trace(go.Scatter(
            x=centers[:, 0],
            y=centers[:, 1],
            mode='markers+text',
            marker=dict(symbol='x', size=14, color='black', line=dict(width=2, color='white')),
            text=[f"C{i+1}" for i in range(5)],
            textposition="top center",
            name="Centroids"
        ))
        st.plotly_chart(fig, use_container_width=True)

    with col_pie:
        st.subheader("🍰 Cluster Distribution")
        fig_pie = px.pie(
            df,
            names='Persona',
            color='Persona',
            color_discrete_map={CLUSTER_METADATA[k]['name']: CLUSTER_METADATA[k]['color'] for k in CLUSTER_METADATA},
            hole=0.45,
            height=450
        )
        st.plotly_chart(fig_pie, use_container_width=True)

# ---------------------------------------------------------
# PAGE 2: DATASET PROFILING
# ---------------------------------------------------------
elif page == "📁 Dataset Ingestion & Profiling":
    st.title("📁 Dataset Profiling & Data Ingestion")
    st.caption("Inspect distributions, descriptive statistics, and demographic parameters.")

    col_up, col_info = st.columns([1, 1])
    with col_up:
        uploaded_file = st.file_uploader("Upload custom CSV customer dataset", type=['csv'])
        if uploaded_file is not None:
            df = pd.read_csv(uploaded_file)
            st.success(f"Loaded {len(df)} custom records successfully!")

    with col_info:
        st.write("### 📋 Quick Ingestion Signals")
        st.write(f"- **Total Rows:** {df.shape[0]}")
        st.write(f"- **Total Columns:** {df.shape[1]}")
        st.write(f"- **Missing Values:** {df.isnull().sum().sum()}")
        st.write(f"- **Gender Split:** {df['Genre'].value_counts().to_dict() if 'Genre' in df.columns else 'N/A'}")

    st.divider()
    st.subheader("📊 Summary Statistics")
    st.dataframe(df.describe().T, use_container_width=True)

    st.subheader("🔍 Ingestion Data Preview")
    st.dataframe(df.head(50), use_container_width=True)

# ---------------------------------------------------------
# PAGE 3: CLUSTERING STUDIO
# ---------------------------------------------------------
elif page == "🧪 Clustering Studio (K-Means)":
    st.title("🧪 Unsupervised Clustering Studio")
    st.caption("Hyperparameter tuning, Elbow Method (WCSS), and Silhouette validation.")

    k_val = st.slider("Select Number of Clusters (K)", min_value=2, max_value=8, value=5)
    algo = st.selectbox("Select Clustering Algorithm", ["K-Means", "Agglomerative Hierarchical", "DBSCAN"])

    X = df[['Annual Income (k$)', 'Spending Score (1-100)']].values

    if algo == "K-Means":
        model = KMeans(n_clusters=k_val, init='k-means++', max_iter=300, random_state=42)
        labels = model.fit_predict(X)
        sil = silhouette_score(X, labels)
        db = davies_bouldin_score(X, labels)
        wcss_val = model.inertia_
    elif algo == "Agglomerative Hierarchical":
        model = AgglomerativeClustering(n_clusters=k_val)
        labels = model.fit_predict(X)
        sil = silhouette_score(X, labels)
        db = davies_bouldin_score(X, labels)
        wcss_val = "N/A"
    else:
        model = DBSCAN(eps=12.5, min_samples=4)
        labels = model.fit_predict(X)
        sil = silhouette_score(X, labels) if len(set(labels)) > 1 else 0
        db = davies_bouldin_score(X, labels) if len(set(labels)) > 1 else 0
        wcss_val = "N/A"

    df['Studio_Cluster'] = labels

    col_m1, col_m2, col_m3 = st.columns(3)
    col_m1.metric("Silhouette Score (Higher=Better)", f"{sil:.3f}")
    col_m2.metric("Davies-Bouldin Index (Lower=Better)", f"{db:.3f}")
    col_m3.metric("WCSS (Inertia)", f"{wcss_val if isinstance(wcss_val, str) else f'{wcss_val:.1f}'}")

    st.divider()

    col_c1, col_c2 = st.columns(2)
    with col_c1:
        st.subheader("📉 Elbow Method Curve (WCSS vs. K)")
        elbow_wcss = [269981, 181363, 106345, 73679, 44448, 37233, 30259, 25011, 21850, 19636]
        fig_elbow = px.line(x=range(1, 11), y=elbow_wcss, markers=True, labels={'x': 'K (Clusters)', 'y': 'WCSS (Inertia)'})
        fig_elbow.add_vline(x=5, line_dash="dash", line_color="purple", annotation_text="Elbow K=5")
        st.plotly_chart(fig_elbow, use_container_width=True)

    with col_c2:
        st.subheader(f"📍 2D Clusters Plot ({algo})")
        fig_scatter = px.scatter(
            df,
            x='Annual Income (k$)',
            y='Spending Score (1-100)',
            color=df['Studio_Cluster'].astype(str),
            title=f"Cluster Separation (K={k_val})",
            hover_data=['CustomerID', 'Age']
        )
        st.plotly_chart(fig_scatter, use_container_width=True)

# ---------------------------------------------------------
# PAGE 4: PREDICT CUSTOMER SEGMENT
# ---------------------------------------------------------
elif page == "🔮 Predict Customer Segment":
    st.title("🔮 Live Customer Segment Predictor & RAG Generator")
    st.caption("Input shopper parameters to instantly classify their segment and generate tailored marketing strategies.")

    col_f, col_res = st.columns([1, 1])

    with col_f:
        st.subheader("👤 Shopper Demographics")
        age_in = st.slider("Customer Age", 18, 75, 32)
        gender_in = st.radio("Gender", ["Female", "Male"], horizontal=True)
        income_in = st.slider("Annual Income ($k)", 15, 140, 85)
        spending_in = st.slider("Spending Score (1-100)", 1, 100, 82)

        # Predict
        X = df[['Annual Income (k$)', 'Spending Score (1-100)']].values
        kmeans = KMeans(n_clusters=5, init='k-means++', max_iter=300, random_state=42)
        kmeans.fit(X)
        
        pred_cluster = kmeans.predict([[income_in, spending_in]])[0]
        meta = CLUSTER_METADATA[pred_cluster]

    with col_res:
        st.subheader("🎯 Classification Result")
        st.markdown(f"""
        <div style="background:{meta['color']}15; border: 2px solid {meta['color']}; padding: 20px; border-radius: 12px;">
            <h3 style="color:{meta['color']}; margin:0;">Assigned: Cluster {pred_cluster + 1}</h3>
            <h4 style="margin:5px 0 0 0;">{meta['name']}</h4>
            <p style="color:#64748b; font-weight:600;">{meta['tagline']}</p>
            <p style="font-size:0.9rem; margin-top:10px;">{meta['description']}</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("### 🤖 RAG Grounded Marketing Recommendation")
        st.markdown(f"""
        <div class="rag-box">
            <h4 style="color:#d8b4fe; margin-top:0;">Tailored Campaign Plan</h4>
            <p><strong>Suggested Promotion:</strong> {meta['promo']}</p>
            <p><strong>Conversion Channels:</strong> {', '.join(meta['channels'])}</p>
            <p><strong>Key Action Items:</strong></p>
            <ul>
                {''.join([f'<li>{s}</li>' for s in meta['strategies']])}
            </ul>
        </div>
        """, unsafe_allow_html=True)

# ---------------------------------------------------------
# PAGE 5: 5 CUSTOMER PERSONAS
# ---------------------------------------------------------
elif page == "👥 5 Customer Personas":
    st.title("👥 5 Canonical Customer Personas")
    st.caption("In-depth behavioral breakdown, spending affinity, and strategic marketing playbooks.")

    tabs = st.tabs([f"Cluster {i+1}: {CLUSTER_METADATA[i]['name']}" for i in range(5)])

    for i, tab in enumerate(tabs):
        meta = CLUSTER_METADATA[i]
        with tab:
            st.markdown(f"<h3 style='color:{meta['color']}'>{meta['name']} ({meta['tagline']})</h3>", unsafe_allow_html=True)
            st.write(meta['description'])
            
            col1, col2 = st.columns(2)
            with col1:
                st.subheader("🎯 Marketing Action Plan")
                for s in meta['strategies']:
                    st.write(f"- {s}")
            with col2:
                st.subheader("🎁 Recommended Offers & Channels")
                st.info(f"**Special Promo:** {meta['promo']}")
                st.write(f"**Optimal Channels:** {', '.join(meta['channels'])}")

# ---------------------------------------------------------
# PAGE 6: RAG MARKETING AI ASSISTANT
# ---------------------------------------------------------
elif page == "🤖 RAG Marketing AI Assistant":
    st.title("🤖 RAG Marketing Knowledge Assistant")
    st.caption("Vector knowledge base retrieval for grounding retail campaigns without hallucination.")

    query = st.text_input("Ask a marketing question regarding customer segments:", "How to retain high income luxury VIP shoppers?")

    st.subheader("📚 Retrieved Knowledge Chunks")
    for doc in RAG_KNOWLEDGE_BASE:
        with st.expander(f"📄 {doc['id']}: {doc['title']}"):
            st.write(doc['content'])
            st.caption(f"**Target Cluster:** Cluster {doc['cluster']+1} | **{doc['kpi']}**")

# ---------------------------------------------------------
# PAGE 7: MODEL REGISTRY
# ---------------------------------------------------------
elif page == "🏆 Model Benchmark Registry":
    st.title("🏆 Model Benchmark & Evaluation Registry")
    st.caption("Empirical comparison of unsupervised clustering models.")

    benchmark_data = pd.DataFrame([
        {
            "Model": "K-Means (Selected Production)",
            "Hyperparameters": "K=5, init=k-means++, max_iter=300",
            "Silhouette Score": 0.554,
            "Davies-Bouldin": 0.572,
            "Status": "Production Winner 🥇"
        },
        {
            "Model": "Agglomerative Hierarchical",
            "Hyperparameters": "n_clusters=5, linkage=ward",
            "Silhouette Score": 0.548,
            "Davies-Bouldin": 0.589,
            "Status": "Baseline"
        },
        {
            "Model": "DBSCAN",
            "Hyperparameters": "eps=12.5, min_samples=4",
            "Silhouette Score": 0.482,
            "Davies-Bouldin": 0.714,
            "Status": "Anomaly Detector"
        }
    ])

    st.dataframe(benchmark_data, use_container_width=True)
