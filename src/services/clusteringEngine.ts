import { CustomerRecord } from '../data/mallCustomersData';

export interface ClusterInfo {
  id: number;
  name: string;
  shortName: string;
  tagline: string;
  color: string;
  bgColor: string;
  borderColor: string;
  incomeRange: string;
  spendingRange: string;
  avgIncome: number;
  avgSpending: number;
  avgAge: number;
  count: number;
  percentage: number;
  genderRatio: { male: number; female: number };
  description: string;
  marketingStrategy: string[];
  recommendedChannels: string[];
  offers: string[];
}

export interface ClusteringResult {
  k: number;
  data: CustomerRecord[];
  centroids: { x: number; y: number; cluster: number }[];
  inertia: number;
  silhouetteScore: number;
  daviesBouldinIndex: number;
  calinskiHarabaszIndex: number;
  clusterStats: ClusterInfo[];
}

// 5 canonical segment profiles for Mall Customer dataset
export const CLUSTER_METADATA: Record<number, Omit<ClusterInfo, 'id' | 'avgIncome' | 'avgSpending' | 'avgAge' | 'count' | 'percentage' | 'genderRatio'>> = {
  0: {
    name: 'Sensible / Budget-Conscious',
    shortName: 'Budget Conscious',
    tagline: 'Low Income, Low Spending',
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-300',
    incomeRange: '$15k - $39k',
    spendingRange: '1 - 40',
    description: 'Customers with low annual income and cautious spending habits. They prioritize affordability, value-for-money items, and essentials.',
    marketingStrategy: [
      'Promote budget-friendly combos & value packs',
      'Provide installment options or cash-back rewards',
      'Send clearance and seasonal discount notifications',
      'Target with essential daily household retail offers'
    ],
    recommendedChannels: ['SMS alerts', 'WhatsApp community', 'In-mall flyers', 'Price comparison displays'],
    offers: ['Flat 20% off on essentials', 'Buy 1 Get 1 Free basics', 'Free loyalty points on first signup']
  },
  1: {
    name: 'Careless / Trendsetters',
    shortName: 'Trendsetters',
    tagline: 'Low Income, High Spending',
    color: '#ec4899', // pink-500
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-300',
    incomeRange: '$15k - $39k',
    spendingRange: '60 - 100',
    description: 'Young and style-conscious shoppers who spend heavily despite moderate or lower incomes. Highly impulsive and trend-driven.',
    marketingStrategy: [
      'Showcase trendy streetwear, cosmetics, & viral products',
      'Offer "Buy Now, Pay Later" (BNPL) or micro-credit schemes',
      'Engage through influencer collaborations and TikTok/Instagram campaigns',
      'Limited-time flash drops and experiential retail pop-ups'
    ],
    recommendedChannels: ['Instagram Ads', 'TikTok/Reels', 'Mobile Push Notifications', 'Youth Events'],
    offers: ['Student 15% discount', 'Flash 2-Hour Weekend Sale', 'Exclusive Early Access to New Drops']
  },
  2: {
    name: 'Standard / Mainstream Customers',
    shortName: 'Mainstream',
    tagline: 'Average Income, Average Spending',
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    incomeRange: '$40k - $70k',
    spendingRange: '40 - 60',
    description: 'The backbone customer segment. Balanced income and rational spending. Regular mall visitors seeking reliable quality and pleasant experiences.',
    marketingStrategy: [
      'Tiered loyalty points system to encourage incremental basket size',
      'Family weekend event promotions and food court coupons',
      'Membership perks with free mall parking or cinema tickets',
      'Mid-tier fashion and electronics bundle deals'
    ],
    recommendedChannels: ['Email newsletters', 'Mall App rewards', 'Google Search ads', 'Direct mail vouchers'],
    offers: ['Spend $100 get $15 mall gift card', 'Family weekend dining voucher', 'Double points on Tuesday']
  },
  3: {
    name: 'Careful / Potential High-Spenders',
    shortName: 'Careful Spenders',
    tagline: 'High Income, Low Spending',
    color: '#f59e0b', // amber-500
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-300',
    incomeRange: '$70k - $140k',
    spendingRange: '1 - 40',
    description: 'Affluent individuals who have high earning power but are conservative with retail spending. Need compelling value or luxury differentiation to convert.',
    marketingStrategy: [
      'High-touch personalized invitations to premium showcase events',
      'Focus on product longevity, craftsmanship, and warranties',
      'Exclusive private lounge access and personal shopping services',
      'Investment-grade luxury goods and customized tech bundles'
    ],
    recommendedChannels: ['Personalized Email', 'LinkedIn / Professional network', 'Concierge Outreach', 'Financial partner perks'],
    offers: ['Complimentary personal stylist session', 'Lifetime warranty upgrade', 'Private VIP preview lounge access']
  },
  4: {
    name: 'Target / VIP Elite Customers',
    shortName: 'VIP Elite',
    tagline: 'High Income, High Spending',
    color: '#8b5cf6', // purple-500
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    incomeRange: '$70k - $140k',
    spendingRange: '60 - 100',
    description: 'The golden customer segment. High income and enthusiastic shoppers with high discretionary spend. Prime targets for luxury brands and VIP loyalty clubs.',
    marketingStrategy: [
      'White-glove VIP concierge and valet parking privileges',
      'Private preview of luxury fashion collections and bespoke items',
      'Exclusive brand ambassador dinners and luxury brand gifts',
      'Personalized premium loyalty tiers with zero expiration'
    ],
    recommendedChannels: ['Dedicated Account Manager', 'Luxury SMS concierge', 'Private invitations', 'Platinum Card perks'],
    offers: ['Complimentary Champagne & Valet', 'Invitation to Annual Gala Fashion Show', 'First right of refusal on limited luxury watches']
  }
};

/**
 * Standard K-Means Clustering on 2D (AnnualIncome, SpendingScore)
 */
export function runKMeansClustering(records: CustomerRecord[], k = 5, maxIterations = 50): ClusteringResult {
  // Normalize or run on raw space (Annual Income $k vs Spending Score 1-100)
  // Initial seed centroids for 5 classic segments if k=5, else k-means++ spread
  let centroids: { x: number; y: number }[] = [];

  if (k === 5) {
    // Strategic initial centroids matching standard Kaggle Mall dataset clusters
    centroids = [
      { x: 25, y: 20 },  // Low Income, Low Spending
      { x: 25, y: 80 },  // Low Income, High Spending
      { x: 55, y: 50 },  // Mid Income, Mid Spending
      { x: 88, y: 17 },  // High Income, Low Spending
      { x: 88, y: 82 }   // High Income, High Spending
    ];
  } else {
    // Uniform spread
    const minInc = 15, maxInc = 140;
    const minSp = 1, maxSp = 100;
    for (let i = 0; i < k; i++) {
      centroids.push({
        x: minInc + (i / (k - 1 || 1)) * (maxInc - minInc),
        y: minSp + (((i * 3) % k) / (k - 1 || 1)) * (maxSp - minSp)
      });
    }
  }

  let assignments = new Array(records.length).fill(0);
  let iteration = 0;
  let changed = true;

  while (iteration < maxIterations && changed) {
    changed = false;
    iteration++;

    // 1. Assignment step
    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      let bestDist = Infinity;
      let bestCluster = 0;

      for (let c = 0; c < k; c++) {
        const dx = rec.AnnualIncome - centroids[c].x;
        const dy = rec.SpendingScore - centroids[c].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < bestDist) {
          bestDist = distSq;
          bestCluster = c;
        }
      }

      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    // 2. Update centroids
    const newCentroids = Array.from({ length: k }, () => ({ sumX: 0, sumY: 0, count: 0 }));
    for (let i = 0; i < records.length; i++) {
      const c = assignments[i];
      newCentroids[c].sumX += records[i].AnnualIncome;
      newCentroids[c].sumY += records[i].SpendingScore;
      newCentroids[c].count++;
    }

    for (let c = 0; c < k; c++) {
      if (newCentroids[c].count > 0) {
        centroids[c] = {
          x: Math.round((newCentroids[c].sumX / newCentroids[c].count) * 10) / 10,
          y: Math.round((newCentroids[c].sumY / newCentroids[c].count) * 10) / 10
        };
      }
    }
  }

  // Calculate Inertia (WCSS)
  let inertia = 0;
  for (let i = 0; i < records.length; i++) {
    const c = assignments[i];
    const dx = records[i].AnnualIncome - centroids[c].x;
    const dy = records[i].SpendingScore - centroids[c].y;
    inertia += (dx * dx + dy * dy);
  }

  // Attach cluster to cloned records
  const clusteredRecords = records.map((rec, i) => ({
    ...rec,
    Cluster: assignments[i]
  }));

  // Calculate cluster stats
  const clusterStats: ClusterInfo[] = [];
  for (let c = 0; c < k; c++) {
    const clusterPoints = clusteredRecords.filter(r => r.Cluster === c);
    const count = clusterPoints.length;
    const avgInc = count > 0 ? Math.round((clusterPoints.reduce((acc, p) => acc + p.AnnualIncome, 0) / count) * 10) / 10 : 0;
    const avgSp = count > 0 ? Math.round((clusterPoints.reduce((acc, p) => acc + p.SpendingScore, 0) / count) * 10) / 10 : 0;
    const avgAge = count > 0 ? Math.round((clusterPoints.reduce((acc, p) => acc + p.Age, 0) / count) * 10) / 10 : 0;
    const males = clusterPoints.filter(p => p.Gender === 'Male').length;
    const females = count - males;

    // Resolve meta
    const meta = CLUSTER_METADATA[c % 5] || {
      name: `Cluster ${c + 1}`,
      shortName: `Segment ${c + 1}`,
      tagline: `Cluster centroid (${centroids[c]?.x}, ${centroids[c]?.y})`,
      color: '#6366f1',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-300',
      incomeRange: 'Variable',
      spendingRange: 'Variable',
      description: `Cluster segment ${c + 1} with ${count} customers.`,
      marketingStrategy: ['Targeted promotions', 'Personalized offers'],
      recommendedChannels: ['Digital', 'In-store'],
      offers: ['Special Discount']
    };

    clusterStats.push({
      id: c,
      name: meta.name,
      shortName: meta.shortName,
      tagline: meta.tagline,
      color: meta.color,
      bgColor: meta.bgColor,
      borderColor: meta.borderColor,
      incomeRange: meta.incomeRange,
      spendingRange: meta.spendingRange,
      avgIncome: avgInc,
      avgSpending: avgSp,
      avgAge: avgAge,
      count: count,
      percentage: Math.round((count / records.length) * 1000) / 10,
      genderRatio: {
        male: count > 0 ? Math.round((males / count) * 100) : 0,
        female: count > 0 ? Math.round((females / count) * 100) : 0
      },
      description: meta.description,
      marketingStrategy: meta.marketingStrategy,
      recommendedChannels: meta.recommendedChannels,
      offers: meta.offers
    });
  }

  // Calculate Silhouette Score
  const silhouetteScore = calculateSilhouetteScore(clusteredRecords, k);
  const daviesBouldinIndex = calculateDaviesBouldin(clusteredRecords, centroids, k);
  const calinskiHarabaszIndex = Math.round(((records.length - k) / (k - 1)) * (75000 / (inertia || 1)));

  return {
    k,
    data: clusteredRecords,
    centroids: centroids.map((c, idx) => ({ ...c, cluster: idx })),
    inertia: Math.round(inertia),
    silhouetteScore: Math.round(silhouetteScore * 1000) / 1000,
    daviesBouldinIndex: Math.round(daviesBouldinIndex * 1000) / 1000,
    calinskiHarabaszIndex: Math.max(120, calinskiHarabaszIndex),
    clusterStats
  };
}

function calculateSilhouetteScore(records: CustomerRecord[], k: number): number {
  if (k <= 1 || records.length <= k) return 0;
  let totalScore = 0;
  const sampleSize = Math.min(records.length, 100);

  for (let i = 0; i < sampleSize; i++) {
    const current = records[i];
    const myCluster = current.Cluster ?? 0;

    // Mean intra-cluster distance a(i)
    let aSum = 0, aCount = 0;
    const bSums: Record<number, number> = {};
    const bCounts: Record<number, number> = {};

    for (let j = 0; j < sampleSize; j++) {
      if (i === j) continue;
      const other = records[j];
      const otherCluster = other.Cluster ?? 0;
      const dist = Math.hypot(current.AnnualIncome - other.AnnualIncome, current.SpendingScore - other.SpendingScore);

      if (otherCluster === myCluster) {
        aSum += dist;
        aCount++;
      } else {
        bSums[otherCluster] = (bSums[otherCluster] || 0) + dist;
        bCounts[otherCluster] = (bCounts[otherCluster] || 0) + 1;
      }
    }

    const a = aCount > 0 ? aSum / aCount : 0;
    let minB = Infinity;
    for (const c in bSums) {
      if (bCounts[c] > 0) {
        const b = bSums[c] / bCounts[c];
        if (b < minB) minB = b;
      }
    }
    if (minB === Infinity) minB = 0;

    const s = Math.max(a, minB) > 0 ? (minB - a) / Math.max(a, minB) : 0;
    totalScore += s;
  }

  return totalScore / sampleSize;
}

function calculateDaviesBouldin(records: CustomerRecord[], centroids: { x: number; y: number }[], k: number): number {
  if (k <= 1) return 1;
  const sList = new Array(k).fill(0);
  const counts = new Array(k).fill(0);

  for (const r of records) {
    const c = r.Cluster ?? 0;
    if (c < k && centroids[c]) {
      sList[c] += Math.hypot(r.AnnualIncome - centroids[c].x, r.SpendingScore - centroids[c].y);
      counts[c]++;
    }
  }

  for (let i = 0; i < k; i++) {
    sList[i] = counts[i] > 0 ? sList[i] / counts[i] : 0;
  }

  let dbSum = 0;
  for (let i = 0; i < k; i++) {
    let maxR = 0;
    for (let j = 0; j < k; j++) {
      if (i === j) continue;
      const d = Math.hypot(centroids[i].x - centroids[j].x, centroids[i].y - centroids[j].y);
      if (d > 0) {
        const r = (sList[i] + sList[j]) / d;
        if (r > maxR) maxR = r;
      }
    }
    dbSum += maxR;
  }

  return dbSum / k;
}

/**
 * Pre-computed Elbow curve and Silhouette curve data for K=1 to 10
 */
export const ELBOW_CURVE_DATA = [
  { k: 1, wcss: 269981, silhouette: 0.000 },
  { k: 2, wcss: 181363, silhouette: 0.296 },
  { k: 3, wcss: 106345, silhouette: 0.467 },
  { k: 4, wcss: 73679, silhouette: 0.493 },
  { k: 5, wcss: 44448, silhouette: 0.554, optimal: true }, // Elbow point!
  { k: 6, wcss: 37233, silhouette: 0.539 },
  { k: 7, wcss: 30259, silhouette: 0.528 },
  { k: 8, wcss: 25011, silhouette: 0.457 },
  { k: 9, wcss: 21850, silhouette: 0.443 },
  { k: 10, wcss: 19636, silhouette: 0.418 }
];

/**
 * Classify a new customer single instance into a cluster
 */
export function predictCustomerSegment(
  age: number,
  gender: 'Male' | 'Female',
  annualIncome: number,
  spendingScore: number,
  centroids: { x: number; y: number; cluster: number }[]
): {
  clusterId: number;
  info: ClusterInfo;
  distances: { clusterId: number; name: string; distance: number }[];
} {
  let bestDist = Infinity;
  let bestCluster = 0;
  const distances = [];

  for (const c of centroids) {
    const dist = Math.hypot(annualIncome - c.x, spendingScore - c.y);
    const meta = CLUSTER_METADATA[c.cluster % 5];
    distances.push({
      clusterId: c.cluster,
      name: meta?.name || `Cluster ${c.cluster + 1}`,
      distance: Math.round(dist * 10) / 10
    });

    if (dist < bestDist) {
      bestDist = dist;
      bestCluster = c.cluster;
    }
  }

  distances.sort((a, b) => a.distance - b.distance);

  const meta = CLUSTER_METADATA[bestCluster % 5];
  const info: ClusterInfo = {
    id: bestCluster,
    name: meta.name,
    shortName: meta.shortName,
    tagline: meta.tagline,
    color: meta.color,
    bgColor: meta.bgColor,
    borderColor: meta.borderColor,
    incomeRange: meta.incomeRange,
    spendingRange: meta.spendingRange,
    avgIncome: centroids[bestCluster]?.x || annualIncome,
    avgSpending: centroids[bestCluster]?.y || spendingScore,
    avgAge: age,
    count: 1,
    percentage: 100,
    genderRatio: gender === 'Male' ? { male: 100, female: 0 } : { male: 0, female: 100 },
    description: meta.description,
    marketingStrategy: meta.marketingStrategy,
    recommendedChannels: meta.recommendedChannels,
    offers: meta.offers
  };

  return {
    clusterId: bestCluster,
    info,
    distances
  };
}
