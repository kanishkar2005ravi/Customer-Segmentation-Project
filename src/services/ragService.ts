export interface RagKnowledgeDoc {
  id: string;
  category: 'VIP & Luxury' | 'Budget & Discount' | 'Mainstream & Loyalty' | 'Youth & Trends' | 'Retention & Upsell' | 'Seasonal Campaigns';
  title: string;
  content: string;
  keywords: string[];
  applicableClusters: number[]; // 0: Budget, 1: Trendsetters, 2: Mainstream, 3: Careful Spenders, 4: VIP Elite
  actionableTactics: string[];
  metrics: string;
}

export const RETAIL_MARKETING_KNOWLEDGE_BASE: RagKnowledgeDoc[] = [
  {
    id: 'RAG-VIP-01',
    category: 'VIP & Luxury',
    title: 'High-Net-Worth VIP Retention & Luxury Concierge Strategy',
    content: 'For customers with high annual income (> $70k) and high spending scores (> 60), traditional discounting diminishes brand prestige. High-end retail research demonstrates that experiential value, personal stylist appointments, private boutique previews, and white-glove valet services yield 4.2x higher customer lifetime value (LTV). Exclusive gala invitations and closed-door shopping nights stimulate high-ticket impulse purchases.',
    keywords: ['vip', 'luxury', 'high income', 'high spending', 'concierge', 'elite', 'valet', 'stylist', 'private preview', 'brand prestige'],
    applicableClusters: [4],
    actionableTactics: [
      'Assign dedicated personal shopper concierge',
      'Provide complimentary valet parking & VIP lounge access',
      'Host private champagne evening previews for new luxury collections',
      'Offer zero-friction bespoke return & alteration service'
    ],
    metrics: 'Expected ROI: +38% basket size, 94% retention rate'
  },
  {
    id: 'RAG-RET-02',
    category: 'Retention & Upsell',
    title: 'Converting High-Income Cautious Spenders into Active Buyers',
    content: 'Customers with high income (> $70k) but low spending scores (< 40) represent untapped revenue potential. These shoppers are risk-averse, quality-conscious, and value utility over trendiness. Marketing must emphasize durability, extended product warranties, authentic craftsmanship, and investment value. Product bundling (e.g., smart home devices, premium kitchenware) with zero-risk trial periods significantly increases conversion by up to 45%.',
    keywords: ['careful', 'high income low spending', 'cautious', 'warranty', 'quality', 'craftsmanship', 'investment', 'upsell', 'longevity'],
    applicableClusters: [3],
    actionableTactics: [
      'Highlight product durability, certifications, and premium materials',
      'Offer satisfaction guarantee with extended 90-day return windows',
      'Provide curated product recommendations based on lifestyle and hobbies',
      'Introduce premium multi-year warranty upgrades'
    ],
    metrics: 'Expected conversion increase: +45%, reduced churn risk'
  },
  {
    id: 'RAG-YOUTH-03',
    category: 'Youth & Trends',
    title: 'Gen-Z and Impulse Trendsetters Monetization via BNPL & Social Drops',
    content: 'Younger demographic segments exhibiting low-to-moderate annual incomes (< $40k) with exceptionally high spending scores (> 70) are driven by social proof, influencer culture, and FOMO (Fear Of Missing Out). Retailers capture this segment via Buy Now Pay Later (BNPL) integrations (e.g., Klarna, Afterpay), TikTok/Instagram live-shopping drops, streetwear pop-up activations, and gamified app reward streaks.',
    keywords: ['trendsetter', 'low income high spending', 'youth', 'gen-z', 'bnpl', 'fomo', 'influencer', 'social media', 'streetwear', 'flash sale'],
    applicableClusters: [1],
    actionableTactics: [
      'Implement seamless 4-installment Buy Now Pay Later (BNPL) checkout',
      'Host limited-quantity 24-hour weekend flash drops',
      'Run student discount days with campus influencer partnerships',
      'Reward in-store selfie check-ins with instant coupon vouchers'
    ],
    metrics: 'Expected sales velocity: +55% drop sell-through, high viral reach'
  },
  {
    id: 'RAG-MAIN-04',
    category: 'Mainstream & Loyalty',
    title: 'Maximizing Share of Wallet in the Middle-Income Mainstream Segment',
    content: 'The middle-income ($40k - $70k), moderate-spending (40 - 60) segment constitutes 40%+ of typical mall footfall. They value consistency, convenience, and family entertainment. Strategies focusing on tiered loyalty memberships, food court dining cross-promotions, family weekend cinema vouchers, and threshold bonuses (e.g., "Spend $100, receive $15 mall cash") drive repeat weekly visit frequency.',
    keywords: ['mainstream', 'middle income', 'average spending', 'family', 'loyalty program', 'dining vouchers', 'cashback', 'weekend'],
    applicableClusters: [2],
    actionableTactics: [
      'Tiered loyalty points with escalating milestone perks',
      'Family weekend bundle packages (Retail + Dining + Cinema)',
      'Mid-week "Double Points" promotions to balance mall footfall',
      'Seasonal school holiday family shopping fairs'
    ],
    metrics: 'Expected visit frequency: +2.1 visits/month, steady revenue baseline'
  },
  {
    id: 'RAG-BUD-05',
    category: 'Budget & Discount',
    title: 'Engaging Sensible & Price-Sensitive Shoppers without Margin Erosion',
    content: 'Price-conscious shoppers with lower income (< $40k) and conservative spending scores (< 40) search for clear value, pantry essentials, and bulk discounts. Directing them toward clearance outlets, private-label essentials, and multi-buy bundling ("Buy 2 Get 1 Free") sustains volume without alienating higher-end shoppers. Low-cost SMS alerts announcing seasonal end-of-quarter clearance generate high weekend conversion.',
    keywords: ['budget', 'price sensitive', 'low income low spending', 'sensible', 'discount', 'clearance', 'essentials', 'value pack', 'bogo'],
    applicableClusters: [0],
    actionableTactics: [
      'Offer value-pack bundling on daily essentials and household goods',
      'Send WhatsApp/SMS alerts for seasonal warehouse clearance events',
      'Introduce community referral rewards (refer a friend, get $5 store credit)',
      'Promote zero-fee basic loyalty registration with instant welcome discount'
    ],
    metrics: 'Expected basket quantity: +28% units per transaction'
  },
  {
    id: 'RAG-SEASON-06',
    category: 'Seasonal Campaigns',
    title: 'Omnichannel Seasonal Campaign & Dynamic Segmentation Playbook',
    content: 'Cross-segment omnichannel marketing utilizes dynamic segmentation algorithms to trigger personalized push messages based on customer purchase recency, income bracket, and category affinity. Holiday seasons (Black Friday, Summer Festive, Back to School) achieve 3.4x higher response rates when the promotion style matches the specific cluster profile rather than generic broadcast blasting.',
    keywords: ['seasonal', 'black friday', 'holiday', 'campaign', 'omnichannel', 'push notification', 'dynamic segmentation'],
    applicableClusters: [0, 1, 2, 3, 4],
    actionableTactics: [
      'Segment email newsletters by income & spending affinity',
      'Coordinate mall-wide Black Friday staggered early-bird VIP hours',
      'Deploy localized geofencing mobile notifications near mall entrances'
    ],
    metrics: 'Overall campaign engagement increase: +62% CTR'
  }
];

export interface RagQueryResult {
  query: string;
  matchedDocs: {
    doc: RagKnowledgeDoc;
    score: number;
    matchedKeywords: string[];
  }[];
  generatedStrategy: string;
  recommendedCampaign: {
    campaignName: string;
    targetSegment: string;
    objective: string;
    suggestedPromo: string;
    channels: string[];
    kpis: string;
  };
}

/**
 * Retrieve relevant documents and generate AI marketing strategy
 */
export function queryRagKnowledgeBase(query: string, targetClusterId?: number): RagQueryResult {
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/[\s,.-]+/).filter(t => t.length > 2);

  const scoredDocs = RETAIL_MARKETING_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Cluster match boost
    if (targetClusterId !== undefined && doc.applicableClusters.includes(targetClusterId)) {
      score += 4.0;
    }

    // Keyword matching
    for (const kw of doc.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 3.0;
        matchedKeywords.push(kw);
      }
    }

    // Title / content token matching
    for (const token of queryTokens) {
      if (doc.title.toLowerCase().includes(token)) {
        score += 2.0;
      }
      if (doc.content.toLowerCase().includes(token)) {
        score += 1.0;
      }
    }

    return {
      doc,
      score: Math.round(score * 10) / 10,
      matchedKeywords: Array.from(new Set(matchedKeywords))
    };
  });

  // Sort by relevance score
  scoredDocs.sort((a, b) => b.score - a.score);
  const matchedDocs = scoredDocs.slice(0, 3);

  // Generate contextual AI Strategy
  const primaryDoc = matchedDocs[0]?.doc || RETAIL_MARKETING_KNOWLEDGE_BASE[0];
  const clusterNames = [
    'Sensible / Budget-Conscious (Cluster 0)',
    'Careless / Trendsetters (Cluster 1)',
    'Standard / Mainstream Customers (Cluster 2)',
    'Careful / Potential High-Spenders (Cluster 3)',
    'Target / VIP Elite Customers (Cluster 4)'
  ];

  const clusterName = targetClusterId !== undefined ? clusterNames[targetClusterId] : 'All Identified Customer Segments';

  const generatedStrategy = `Based on retrieved knowledge from "${primaryDoc.title}" and the ML cluster profile for ${clusterName}:

1. Core Strategy: ${primaryDoc.content.slice(0, 240)}...
2. Immediate Action Items:
${primaryDoc.actionableTactics.map((t, idx) => `   - Step ${idx + 1}: ${t}`).join('\n')}
3. Impact Assessment: ${primaryDoc.metrics}.`;

  const recommendedCampaign = {
    campaignName: `${primaryDoc.category} Acceleration Initiative`,
    targetSegment: clusterName,
    objective: `Maximize customer lifetime value (LTV) and shopping frequency for ${clusterName} using tailored retail touchpoints.`,
    suggestedPromo: primaryDoc.actionableTactics[0] || 'Exclusive Tiered Bonus',
    channels: primaryDoc.applicableClusters.includes(4) 
      ? ['VIP Concierge SMS', 'Private Luxury Salon', 'Direct Mail Invitation']
      : primaryDoc.applicableClusters.includes(1)
      ? ['TikTok / Instagram Ads', 'Mobile App Push', 'In-store Flash Display']
      : ['Email Newsletter', 'Mall Loyalty App', 'Weekend Food & Cinema Coupons'],
    kpis: primaryDoc.metrics
  };

  return {
    query,
    matchedDocs,
    generatedStrategy,
    recommendedCampaign
  };
}
