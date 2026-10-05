import React from 'react';
import { 
  BrainCircuit, 
  Award, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Zap, 
  Info,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const ModelRegistry: React.FC = () => {
  const models = [
    {
      name: 'K-Means Clustering (Selected Production Model)',
      type: 'Centroid-Based Partitioning',
      hyperparameters: 'K = 5, init = k-means++, max_iter = 300, random_state = 42',
      silhouette: '0.554',
      daviesBouldin: '0.572',
      calinskiHarabasz: '125.8',
      inertia: '44,448',
      speed: '0.012s',
      status: 'Production Winner',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      pros: 'Globally clear 5-quadrant separation on Income vs Spending Score, highly interpretable for business stakeholder personas.',
      cons: 'Assumes spherical cluster shapes (mitigated by clean 2D feature distribution).'
    },
    {
      name: 'Hierarchical / Agglomerative Clustering',
      type: 'Bottom-Up Ward Linkage',
      hyperparameters: 'n_clusters = 5, linkage = "ward", metric = "euclidean"',
      silhouette: '0.548',
      daviesBouldin: '0.589',
      calinskiHarabasz: '121.3',
      inertia: '46,120',
      speed: '0.038s',
      status: 'Benchmark Baseline',
      statusColor: 'bg-blue-100 text-blue-800 border-blue-300',
      pros: 'Produces deterministic dendrogram hierarchy without random initialization seeds.',
      cons: 'Higher computational complexity O(n^3) for massive scaling.'
    },
    {
      name: 'DBSCAN (Density-Based Spatial Clustering)',
      type: 'Density-Based with Noise Detection',
      hyperparameters: 'eps = 12.5, min_samples = 4, metric = "euclidean"',
      silhouette: '0.482',
      daviesBouldin: '0.714',
      calinskiHarabasz: '98.4',
      inertia: 'N/A (Density)',
      speed: '0.024s',
      status: 'Anomaly Detector',
      statusColor: 'bg-purple-100 text-purple-800 border-purple-300',
      pros: 'Naturally filters out 6 extreme demographic outliers without corrupting cluster cores.',
      cons: 'Struggles with varying density between low-income and high-income customer pockets.'
    },
    {
      name: 'Gaussian Mixture Models (GMM)',
      type: 'Probabilistic Expectation-Maximization',
      hyperparameters: 'n_components = 5, covariance_type = "full", random_state = 42',
      silhouette: '0.536',
      daviesBouldin: '0.612',
      calinskiHarabasz: '116.2',
      inertia: 'N/A (Log-Likelihood)',
      speed: '0.045s',
      status: 'Probabilistic Model',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-300',
      pros: 'Outputs soft cluster probability memberships for borderline customers.',
      cons: 'Sensitive to local optima and covariance initialization.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
          <span>MODEL GOVERNANCE / EVALUATION REGISTRY</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Machine Learning Model Comparison & Registry</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Empirical comparison of unsupervised clustering architectures evaluated on the Mall Customers benchmark dataset.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-600" /> Quantitative Benchmark Evaluation
          </h3>
          <span className="text-xs text-gray-500">Benchmark on 200 Customer Samples</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Silhouette Score (Higher = Better)</th>
                <th className="py-3 px-4 text-center">Davies-Bouldin (Lower = Better)</th>
                <th className="py-3 px-4 text-center">Calinski-Harabasz</th>
                <th className="py-3 px-4 text-center">Inference Time</th>
                <th className="py-3 px-4">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {models.map((m, idx) => (
                <tr key={idx} className="hover:bg-purple-50/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-purple-600" />
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{m.type}</td>
                  <td className="py-3 px-4 text-center font-extrabold text-emerald-600">
                    {m.silhouette}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-indigo-600">
                    {m.daviesBouldin}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-gray-800">
                    {m.calinskiHarabasz}
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-gray-500">
                    {m.speed}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${m.statusColor}`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Deep-Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {models.map((m, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${m.statusColor}`}>
                  {m.status}
                </span>
                <span className="text-[11px] font-mono text-gray-400">{m.speed}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-900">{m.name}</h4>
              <p className="text-xs font-mono text-purple-700 mt-1 bg-purple-50 p-1.5 rounded-lg border border-purple-100">
                {m.hyperparameters}
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <p className="text-gray-700">
                  <strong className="text-emerald-700">Strengths:</strong> {m.pros}
                </p>
                <p className="text-gray-700">
                  <strong className="text-amber-700">Trade-offs:</strong> {m.cons}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-800">
              <span>Silhouette: {m.silhouette}</span>
              <span>Davies-Bouldin: {m.daviesBouldin}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
