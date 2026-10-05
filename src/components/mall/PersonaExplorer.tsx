import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  DollarSign, 
  ShoppingBag, 
  Megaphone, 
  Share2, 
  ArrowRight,
  Gift,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ClusteringResult } from '../../services/clusteringEngine';

interface PersonaExplorerProps {
  clusteringResult: ClusteringResult;
  onSelectClusterForRag: (clusterId: number) => void;
}

export const PersonaExplorer: React.FC<PersonaExplorerProps> = ({
  clusteringResult,
  onSelectClusterForRag
}) => {
  const { clusterStats } = clusteringResult;
  const [selectedClusterId, setSelectedClusterId] = useState<number>(4); // Default to VIP

  const selectedCluster = clusterStats.find(c => c.id === selectedClusterId) || clusterStats[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
          <span>PRECISION TARGETING / PERSONA PROFILES</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Customer Personas & Marketing Playbooks</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Detailed behavioral characteristics, demographic profiles, and strategic promotion roadmaps for every customer cluster.
        </p>
      </div>

      {/* Cluster Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {clusterStats.map((c) => {
          const isSelected = c.id === selectedClusterId;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedClusterId(c.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: c.color }}
              />
              <span>Cluster {c.id + 1}: {c.shortName}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded ${isSelected ? 'bg-slate-800 text-purple-300' : 'bg-gray-100 text-gray-600'}`}>
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Persona Detail Banner */}
      {selectedCluster && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Persona Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: selectedCluster.color }}
                >
                  Cluster {selectedCluster.id + 1}
                </span>
                <span className="text-xs font-bold text-gray-500">
                  {selectedCluster.percentage}% of Mall Customers
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900">{selectedCluster.name}</h3>
              <p className="text-sm font-semibold text-purple-600 mt-1">{selectedCluster.tagline}</p>
              
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                {selectedCluster.description}
              </p>

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Income Range:</span>
                  <span className="font-bold text-gray-900">{selectedCluster.incomeRange}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Spending Score Range:</span>
                  <span className="font-bold text-gray-900">{selectedCluster.spendingRange} / 100</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500 font-medium">Average Age:</span>
                  <span className="font-bold text-gray-900">{selectedCluster.avgAge} years</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-500 font-medium">Gender Ratio:</span>
                  <span className="font-bold text-gray-900">
                    {selectedCluster.genderRatio.female}% Female / {selectedCluster.genderRatio.male}% Male
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectClusterForRag(selectedCluster.id)}
              className="mt-6 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Generate Custom RAG Strategy
            </button>
          </div>

          {/* Marketing Strategies & Campaign Playbook (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Tactics list */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" /> Recommended Strategic Action Plan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedCluster.marketingStrategy.map((strat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-gray-800 leading-snug">{strat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Channels & Special Offers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-indigo-600" /> High-Conversion Channels
                </h4>
                <div className="space-y-2">
                  {selectedCluster.recommendedChannels.map((ch, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span className="font-semibold">{ch}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Gift className="w-4 h-4 text-pink-600" /> Tailored Promotional Offers
                </h4>
                <div className="space-y-2">
                  {selectedCluster.offers.map((offer, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-pink-900 bg-pink-50/60 px-3 py-2 rounded-lg border border-pink-100 font-medium">
                      <Gift className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span>{offer}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
