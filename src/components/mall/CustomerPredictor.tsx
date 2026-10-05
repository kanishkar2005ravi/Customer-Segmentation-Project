import React, { useState } from 'react';
import { 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  Bot, 
  Gift, 
  Send, 
  CheckCircle, 
  Target, 
  ShoppingBag, 
  DollarSign, 
  Smile,
  Compass
} from 'lucide-react';
import { ClusteringResult, predictCustomerSegment } from '../../services/clusteringEngine';
import { queryRagKnowledgeBase, RagQueryResult } from '../../services/ragService';

interface CustomerPredictorProps {
  clusteringResult: ClusteringResult;
  onNavigateToRag: () => void;
}

export const CustomerPredictor: React.FC<CustomerPredictorProps> = ({
  clusteringResult,
  onNavigateToRag
}) => {
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female'>('Female');
  const [annualIncome, setAnnualIncome] = useState<number>(85);
  const [spendingScore, setSpendingScore] = useState<number>(80);
  
  const [prediction, setPrediction] = useState<ReturnType<typeof predictCustomerSegment> | null>(() => {
    return predictCustomerSegment(28, 'Female', 85, 80, clusteringResult.centroids);
  });

  const [ragResult, setRagResult] = useState<RagQueryResult | null>(() => {
    return queryRagKnowledgeBase('Luxury VIP retention and personal shopper strategy', 4);
  });

  const handlePredict = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = predictCustomerSegment(age, gender, annualIncome, spendingScore, clusteringResult.centroids);
    setPrediction(res);

    // Trigger RAG strategy generation
    const rag = queryRagKnowledgeBase(`Marketing strategy and tailored promotions for ${res.info.name}`, res.clusterId);
    setRagResult(rag);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
          <span>REAL-TIME INFERENCE / CUSTOMER SEGMENTATION</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Live Customer Segment Predictor & RAG Generator</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Input customer demographics and purchasing behavior to instantly classify their shopping segment and generate AI-driven marketing campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-purple-600" /> Customer Profile Input
          </h3>

          <form onSubmit={handlePredict} className="space-y-4">
            {/* Gender Selection */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('Female')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    gender === 'Female'
                      ? 'bg-pink-50 border-pink-300 text-pink-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Female
                </button>
                <button
                  type="button"
                  onClick={() => setGender('Male')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    gender === 'Male'
                      ? 'bg-blue-50 border-blue-300 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Male
                </button>
              </div>
            </div>

            {/* Age Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
                <span>Age:</span>
                <span className="text-purple-600 text-sm font-extrabold">{age} years old</span>
              </div>
              <input
                type="range"
                min={18}
                max={75}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>18 yrs</span>
                <span>75 yrs</span>
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
                <span>Annual Income:</span>
                <span className="text-purple-600 text-sm font-extrabold">${annualIncome}k / year</span>
              </div>
              <input
                type="range"
                min={15}
                max={140}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>$15k (Low)</span>
                <span>$70k (Mid)</span>
                <span>$140k (Affluent)</span>
              </div>
            </div>

            {/* Spending Score */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-700 mb-1">
                <span>Spending Score:</span>
                <span className="text-pink-600 text-sm font-extrabold">{spendingScore} / 100</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={spendingScore}
                onChange={(e) => setSpendingScore(Number(e.target.value))}
                className="w-full accent-pink-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>1 (Frugal)</span>
                <span>50 (Moderate)</span>
                <span>100 (High Discretionary)</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4" /> Run Segmentation & Retrieve AI Strategy
            </button>
          </form>

          {/* Quick Preset Personas */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-500 uppercase block mb-2">Test Quick Presets:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setAnnualIncome(90); setSpendingScore(85); setAge(30); }}
                className="p-1.5 text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg border border-purple-200 text-left truncate cursor-pointer"
              >
                💎 High Inc + High Spend
              </button>
              <button
                type="button"
                onClick={() => { setAnnualIncome(25); setSpendingScore(88); setAge(21); }}
                className="p-1.5 text-[11px] font-medium bg-pink-50 hover:bg-pink-100 text-pink-800 rounded-lg border border-pink-200 text-left truncate cursor-pointer"
              >
                🔥 Low Inc + High Spend
              </button>
              <button
                type="button"
                onClick={() => { setAnnualIncome(85); setSpendingScore(20); setAge(48); }}
                className="p-1.5 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 text-left truncate cursor-pointer"
              >
                🛡️ High Inc + Low Spend
              </button>
              <button
                type="button"
                onClick={() => { setAnnualIncome(22); setSpendingScore(15); setAge(55); }}
                className="p-1.5 text-[11px] font-medium bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-lg border border-sky-200 text-left truncate cursor-pointer"
              >
                🏷️ Low Inc + Low Spend
              </button>
            </div>
          </div>
        </div>

        {/* Prediction Results & RAG Strategy (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {prediction && (
            <>
              {/* Classified Card */}
              <div 
                className={`rounded-xl border p-5 shadow-xs transition-all ${prediction.info.bgColor} ${prediction.info.borderColor}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider"
                      style={{ backgroundColor: prediction.info.color }}
                    >
                      Assigned to Cluster {prediction.clusterId + 1}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{prediction.info.name}</h3>
                    <p className="text-xs font-semibold text-gray-600">{prediction.info.tagline}</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-white/60 text-right sm:min-w-32">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Centroid Distance</span>
                    <p className="text-lg font-extrabold text-gray-900">
                      {prediction.distances[0]?.distance} units
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Nearest Match</span>
                  </div>
                </div>

                <p className="text-xs text-gray-700 mt-3 leading-relaxed">
                  {prediction.info.description}
                </p>

                {/* Distance to all clusters */}
                <div className="mt-4 pt-3 border-t border-gray-200/60">
                  <h4 className="text-[11px] font-bold text-gray-700 uppercase mb-1.5">Centroid Proximity Ranking:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {prediction.distances.slice(0, 3).map((d, i) => (
                      <div key={d.clusterId} className="bg-white/90 p-2 rounded-lg text-xs border border-gray-200/50">
                        <span className="text-[10px] text-gray-400 font-bold">#{i+1} Cluster {d.clusterId + 1}</span>
                        <p className="font-semibold text-gray-800 truncate">{d.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">Distance: {d.distance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RAG Marketing Campaign Synthesis */}
              {ragResult && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                        <Bot className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900">AI Synthesized Marketing Campaign</h4>
                    </div>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-2 py-0.5 rounded border border-purple-200">
                      RAG Verified
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-purple-300 font-bold">{ragResult.recommendedCampaign.campaignName}</span>
                      <span className="text-gray-400 text-[11px]">{ragResult.recommendedCampaign.targetSegment}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 font-bold text-[11px] uppercase">Campaign Objective:</span>
                      <p className="text-slate-200 mt-0.5">{ragResult.recommendedCampaign.objective}</p>
                    </div>

                    <div>
                      <span className="text-gray-400 font-bold text-[11px] uppercase">Recommended Offer / Promo:</span>
                      <div className="p-2 bg-slate-800/80 rounded-lg text-pink-300 font-semibold mt-0.5 flex items-center gap-2">
                        <Gift className="w-4 h-4 shrink-0" />
                        <span>{ragResult.recommendedCampaign.suggestedPromo}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-gray-400 font-bold text-[11px] uppercase">Optimal Marketing Channels:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {ragResult.recommendedCampaign.channels.map((ch, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-800 text-purple-200 rounded text-[11px]">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center justify-between">
                      <span>{ragResult.recommendedCampaign.kpis}</span>
                      <button
                        onClick={onNavigateToRag}
                        className="text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Explore Knowledge Chunks <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
