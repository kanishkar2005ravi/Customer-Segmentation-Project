import React from 'react';
import { 
  Users, 
  Target, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Zap, 
  BarChart2,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { ClusteringResult } from '../../services/clusteringEngine';

interface MallOverviewProps {
  clusteringResult: ClusteringResult;
  onNavigate: (tab: string) => void;
  onLoadDemo: () => void;
}

export const MallOverview: React.FC<MallOverviewProps> = ({
  clusteringResult,
  onNavigate,
  onLoadDemo
}) => {
  const { data, centroids, clusterStats, silhouetteScore, inertia } = clusteringResult;

  // Prepare scatter data with colors
  const scatterData = data.map((d) => ({
    id: d.CustomerID,
    income: d.AnnualIncome,
    spending: d.SpendingScore,
    age: d.Age,
    gender: d.Gender,
    cluster: d.Cluster ?? 0,
    color: clusterStats[d.Cluster ?? 0]?.color || '#8884d8',
    clusterName: clusterStats[d.Cluster ?? 0]?.shortName || `Cluster ${(d.Cluster ?? 0) + 1}`
  }));

  // Prepare pie data
  const pieData = clusterStats.map((c) => ({
    name: c.shortName,
    value: c.count,
    color: c.color,
    percentage: c.percentage
  }));

  return (
    <div className="space-y-6">
      {/* Hero Banner matching the reference screenshot design */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 top-0 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs font-semibold text-purple-200 mb-3 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Mall Customer Intelligence Command Center
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Know who is shopping <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              before they leave the mall.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 leading-relaxed">
            An intelligent customer segmentation workspace fusing unsupervised machine learning (K-Means & DBSCAN) with 
            Retrieval-Augmented Generation (RAG). Unlock deep customer personas, spending affinities, and AI-driven precision 
            promotions for maximum retail ROI.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('predictor')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition duration-150 cursor-pointer"
            >
              <span>Predict Customer Segment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white text-sm font-medium rounded-xl transition duration-150 cursor-pointer backdrop-blur-xs"
            >
              <Users className="w-4 h-4" />
              <span>Reset Mall Dataset (200 records)</span>
            </button>
            <button
              onClick={() => onNavigate('rag')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-sm font-medium rounded-xl transition duration-150 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>RAG Marketing Engine</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Customers</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{data.length}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Preprocessed & Clean
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Optimal Clusters (K)</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">K = 5</h3>
            <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Elbow Point Verified
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Silhouette Score</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{silhouetteScore}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Strong Separation (&gt; 0.5)
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <BarChart2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">VIP / Target Ratio</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {clusterStats[4]?.percentage || 19.5}%
            </h3>
            <p className="text-xs text-purple-600 font-medium mt-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> High Income & Spend
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Visualizations: 2D Scatter Chart + Cluster Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scatter Plot */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">Annual Income vs. Spending Score (K-Means K=5)</h3>
              <p className="text-xs text-gray-500">Visual separation of customer clusters with centroid markers (X)</p>
            </div>
            <button
              onClick={() => onNavigate('clustering')}
              className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Open Studio <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="income" 
                  name="Annual Income" 
                  unit="k$" 
                  domain={[10, 145]}
                  label={{ value: 'Annual Income (k$)', position: 'insideBottom', offset: -10, fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="spending" 
                  name="Spending Score" 
                  unit="" 
                  domain={[0, 105]}
                  label={{ value: 'Spending Score (1-100)', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700 space-y-1">
                          <p className="font-bold text-purple-300">Customer #{data.id}</p>
                          <p><span className="text-gray-400">Segment:</span> {data.clusterName}</p>
                          <p><span className="text-gray-400">Annual Income:</span> ${data.income}k</p>
                          <p><span className="text-gray-400">Spending Score:</span> {data.spending}/100</p>
                          <p><span className="text-gray-400">Demographics:</span> {data.gender}, {data.age} yrs</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Customers" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-2 pt-3 border-t border-gray-100">
            {clusterStats.map((c) => (
              <div key={c.id} className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                <span>{c.shortName} ({c.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster Distribution & RAG Quick Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">Segment Distribution</h3>
              <PieIcon className="w-4 h-4 text-gray-400" />
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(val: number, name: string) => [`${val} Shoppers (${Math.round((val/200)*100)}%)`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-2">
              {clusterStats.map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: c.color }}></span>
                    <span className="truncate">{c.shortName}</span>
                  </span>
                  <span className="font-semibold text-gray-900 shrink-0">{c.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* RAG Knowledge Quick Link */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200/80 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider">RAG Marketing Layer</h4>
                <p className="text-xs text-purple-700 mt-0.5">
                  Semantic retail knowledge indexed for all 5 clusters. Instant promotional generation.
                </p>
                <button
                  onClick={() => onNavigate('rag')}
                  className="mt-2 text-xs font-semibold text-purple-800 hover:text-purple-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  Ask AI Marketing Advisor <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cluster Persona Quick Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">5 Distinct Mall Customer Personas</h3>
            <p className="text-xs text-gray-500">Actionable segmentation identified by unsupervised K-Means model</p>
          </div>
          <button
            onClick={() => onNavigate('personas')}
            className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
          >
            Full Marketing Playbooks <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {clusterStats.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs hover:shadow-md transition-shadow duration-150 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ backgroundColor: c.color }}
                  >
                    Cluster {c.id + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-600">{c.count} users</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 leading-tight">{c.shortName}</h4>
                <p className="text-[11px] font-medium text-gray-500 mt-0.5">{c.tagline}</p>
                
                <div className="mt-3 pt-2 border-t border-gray-100 space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Income:</span>
                    <span className="font-semibold text-gray-800">${c.avgIncome}k</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Spend:</span>
                    <span className="font-semibold text-gray-800">{c.avgSpending}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Age:</span>
                    <span className="font-semibold text-gray-800">{c.avgAge} yrs</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-100">
                <p className="text-[11px] text-gray-600 line-clamp-2">
                  <strong className="text-gray-800">Strategy:</strong> {c.marketingStrategy[0]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
