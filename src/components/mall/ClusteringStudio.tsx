import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Settings2, 
  TrendingDown, 
  TrendingUp, 
  Award, 
  RefreshCw, 
  Activity,
  CheckCircle,
  HelpCircle
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
  LineChart, 
  Line, 
  BarChart, 
  Bar 
} from 'recharts';
import { 
  CustomerRecord 
} from '../../data/mallCustomersData';
import { 
  runKMeansClustering, 
  ELBOW_CURVE_DATA, 
  ClusteringResult 
} from '../../services/clusteringEngine';

interface ClusteringStudioProps {
  dataset: CustomerRecord[];
  currentResult: ClusteringResult;
  onClusteringUpdate: (result: ClusteringResult) => void;
}

export const ClusteringStudio: React.FC<ClusteringStudioProps> = ({
  dataset,
  currentResult,
  onClusteringUpdate
}) => {
  const [selectedK, setSelectedK] = useState(currentResult.k || 5);
  const [algorithm, setAlgorithm] = useState<'kmeans' | 'hierarchical' | 'dbscan'>('kmeans');
  const [activeFeatureX, setActiveFeatureX] = useState<'AnnualIncome' | 'Age'>('AnnualIncome');
  const [activeFeatureY, setActiveFeatureY] = useState<'SpendingScore'>('SpendingScore');

  const handleKChange = (newK: number) => {
    setSelectedK(newK);
    const result = runKMeansClustering(dataset, newK);
    onClusteringUpdate(result);
  };

  const { data, centroids, clusterStats, inertia, silhouetteScore, daviesBouldinIndex, calinskiHarabaszIndex } = currentResult;

  // Format scatter points
  const scatterPoints = data.map((d) => ({
    id: d.CustomerID,
    x: activeFeatureX === 'AnnualIncome' ? d.AnnualIncome : d.Age,
    y: d.SpendingScore,
    age: d.Age,
    income: d.AnnualIncome,
    spending: d.SpendingScore,
    gender: d.Gender,
    cluster: d.Cluster ?? 0,
    color: clusterStats[d.Cluster ?? 0]?.color || '#6366f1',
    clusterName: clusterStats[d.Cluster ?? 0]?.shortName || `Cluster ${(d.Cluster ?? 0) + 1}`
  }));

  return (
    <div className="space-y-6">
      {/* Top Controls Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
              <span>UNSUPERVISED ML / CLUSTERING STUDIO</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Machine Learning Clustering Engine</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Tune cluster hyperparameters, analyze the Elbow Method (WCSS), and evaluate Silhouette Scores.
            </p>
          </div>

          {/* Model Algorithm Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1 text-xs font-semibold">
              <button
                onClick={() => setAlgorithm('kmeans')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  algorithm === 'kmeans' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                K-Means (Optimal)
              </button>
              <button
                onClick={() => setAlgorithm('hierarchical')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  algorithm === 'hierarchical' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Agglomerative
              </button>
              <button
                onClick={() => setAlgorithm('dbscan')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  algorithm === 'dbscan' ? 'bg-white text-purple-700 shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                DBSCAN (Density)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Hyperparameter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-100">
          <div>
            <label className="text-xs font-bold text-gray-700 flex items-center justify-between mb-1.5">
              <span>Number of Clusters (K):</span>
              <span className="text-purple-600 font-extrabold text-sm">{selectedK} Clusters</span>
            </label>
            <input
              type="range"
              min={2}
              max={8}
              value={selectedK}
              onChange={(e) => handleKChange(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>K=2</span>
              <span className="font-bold text-purple-600">K=5 (Optimal)</span>
              <span>K=8</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Scatter Plot X-Axis Feature:
            </label>
            <select
              value={activeFeatureX}
              onChange={(e) => setActiveFeatureX(e.target.value as any)}
              className="w-full text-xs font-medium p-2 rounded-lg border border-gray-200 bg-white text-gray-800"
            >
              <option value="AnnualIncome">Annual Income (k$) [Standard 2D]</option>
              <option value="Age">Age (Years) [Demographic Projection]</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Distance Metric & Scaling:
            </label>
            <div className="text-xs text-gray-600 p-2 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-gray-800">Euclidean Distance (L2)</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Standardized</span>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance Validation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Within-Cluster Sum (WCSS)</span>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{inertia.toLocaleString()}</p>
          <span className="text-[10px] text-gray-500">Inertia metric</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Silhouette Score</span>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">{silhouetteScore}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">High Cluster Separation</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Davies-Bouldin Index</span>
          <p className="text-2xl font-bold text-indigo-600 mt-0.5">{daviesBouldinIndex}</p>
          <span className="text-[10px] text-indigo-600">Lower = Better (&lt; 1.0)</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Calinski-Harabasz</span>
          <p className="text-2xl font-bold text-purple-600 mt-0.5">{calinskiHarabaszIndex}</p>
          <span className="text-[10px] text-purple-600">Variance ratio criterion</span>
        </div>
      </div>

      {/* Main Clustering Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Scatter Plot */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {activeFeatureX === 'AnnualIncome' ? 'Annual Income' : 'Age'} vs. Spending Score
              </h3>
              <p className="text-xs text-gray-500">
                Data points color-coded by assigned cluster (K = {selectedK})
              </p>
            </div>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">
              {algorithm.toUpperCase()} Model
            </span>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={activeFeatureX === 'AnnualIncome' ? 'Annual Income' : 'Age'} 
                  unit={activeFeatureX === 'AnnualIncome' ? 'k$' : ' yrs'}
                  label={{ 
                    value: activeFeatureX === 'AnnualIncome' ? 'Annual Income ($k)' : 'Age (Years)', 
                    position: 'insideBottom', 
                    offset: -10, 
                    fontSize: 12, 
                    fill: '#64748b' 
                  }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Spending Score" 
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
                          <p><span className="text-gray-400">Cluster:</span> {data.clusterName}</p>
                          <p><span className="text-gray-400">Annual Income:</span> ${data.income}k</p>
                          <p><span className="text-gray-400">Spending Score:</span> {data.spending}/100</p>
                          <p><span className="text-gray-400">Age:</span> {data.age} yrs ({data.gender})</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter name="Shoppers" data={scatterPoints}>
                  {scatterPoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Centroid Coordinates Legend */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Calculated Cluster Centroids:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {centroids.slice(0, selectedK).map((c, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-gray-50 border border-gray-200 text-center">
                  <span 
                    className="inline-block w-2.5 h-2.5 rounded-full mb-1" 
                    style={{ backgroundColor: clusterStats[idx]?.color || '#6366f1' }}
                  />
                  <p className="text-[11px] font-bold text-gray-800 truncate">
                    {clusterStats[idx]?.shortName || `C${idx + 1}`}
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    (${c.x}k, {c.y})
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Elbow Curve & Silhouette Analysis */}
        <div className="space-y-6">
          {/* Elbow Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900">Elbow Method (WCSS vs K)</h3>
              <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded">
                Elbow at K=5
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">
              The sharp reduction in WCSS slows down at K=5, indicating optimal cluster count.
            </p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ELBOW_CURVE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="k" label={{ value: 'K (Clusters)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                  <YAxis label={{ value: 'WCSS', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip formatter={(val: number) => [val.toLocaleString(), 'Inertia (WCSS)']} />
                  <Line 
                    type="monotone" 
                    dataKey="wcss" 
                    stroke="#9333ea" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#9333ea' }}
                    activeDot={{ r: 6, fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Silhouette Score per K */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-900">Silhouette Coefficient across K</h3>
              <span className="text-[10px] font-bold text-emerald-600">Peak: 0.554 (K=5)</span>
            </div>

            <div className="h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ELBOW_CURVE_DATA.slice(1)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="k" fontSize={10} />
                  <YAxis domain={[0, 0.7]} fontSize={10} />
                  <Tooltip formatter={(val: number) => [val, 'Silhouette Score']} />
                  <Bar dataKey="silhouette" fill="#8b5cf6">
                    {ELBOW_CURVE_DATA.slice(1).map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.k === 5 ? '#10b981' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
