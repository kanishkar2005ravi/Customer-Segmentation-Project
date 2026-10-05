import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Search, 
  Database, 
  BookOpen, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Layers, 
  Target, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { queryRagKnowledgeBase, RagQueryResult, RETAIL_MARKETING_KNOWLEDGE_BASE } from '../../services/ragService';

interface RagMarketingHubProps {
  initialClusterId?: number;
}

export const RagMarketingHub: React.FC<RagMarketingHubProps> = ({ initialClusterId }) => {
  const [query, setQuery] = useState('How should the mall retain high income VIP shoppers and maximize luxury spend?');
  const [selectedCluster, setSelectedCluster] = useState<number | undefined>(initialClusterId ?? 4);
  const [result, setResult] = useState<RagQueryResult>(() => 
    queryRagKnowledgeBase('How should the mall retain high income VIP shoppers and maximize luxury spend?', initialClusterId ?? 4)
  );

  const samplePrompts = [
    { text: 'Retaining high-income VIP shoppers with luxury concierge', cluster: 4 },
    { text: 'Monetizing Gen-Z trendsetters with BNPL and flash sales', cluster: 1 },
    { text: 'Converting high-income careful spenders with product warranties', cluster: 3 },
    { text: 'Maximizing family weekend footfall with dining & cinema bundles', cluster: 2 },
    { text: 'Engaging budget-conscious shoppers with bulk discounts', cluster: 0 }
  ];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    const res = queryRagKnowledgeBase(query, selectedCluster);
    setResult(res);
  };

  const handlePresetClick = (presetText: string, cluster: number) => {
    setQuery(presetText);
    setSelectedCluster(cluster);
    const res = queryRagKnowledgeBase(presetText, cluster);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
          <span>RAG ARCHITECTURE / KNOWLEDGE-GROUNDED AI</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-1">Retrieval-Augmented Generation (RAG) Marketing Engine</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Combines unsupervised customer segment classification with specialized retail domain knowledge retrieval to synthesize evidence-backed marketing campaigns.
        </p>
      </div>

      {/* RAG Workflow Architecture diagram */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-3">
          RAG Pipeline Execution Flow
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-purple-400 font-bold block">STEP 1</span>
            <p className="font-semibold text-slate-200 mt-1">Customer Input</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Income, Spend, Age</p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-purple-400 font-bold block">STEP 2</span>
            <p className="font-semibold text-slate-200 mt-1">ML Clustering</p>
            <p className="text-[11px] text-slate-400 mt-0.5">K-Means Cluster ID</p>
          </div>
          <div className="p-3 bg-purple-900/50 rounded-xl border border-purple-500/40">
            <span className="text-[10px] text-purple-300 font-bold block">STEP 3</span>
            <p className="font-semibold text-white mt-1">RAG Retrieval</p>
            <p className="text-[11px] text-purple-200 mt-0.5">Vector Knowledge DB</p>
          </div>
          <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <span className="text-[10px] text-purple-400 font-bold block">STEP 4</span>
            <p className="font-semibold text-slate-200 mt-1">Context Injection</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Top-3 Knowledge Chunks</p>
          </div>
          <div className="p-3 bg-emerald-900/40 rounded-xl border border-emerald-500/40">
            <span className="text-[10px] text-emerald-300 font-bold block">STEP 5</span>
            <p className="font-semibold text-emerald-200 mt-1">AI Marketing Strategy</p>
            <p className="text-[11px] text-emerald-300 mt-0.5">Actionable Campaign</p>
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything regarding retail marketing, retention, promotions, or segment strategy..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-gray-800"
            />
          </div>

          <select
            value={selectedCluster ?? ''}
            onChange={(e) => setSelectedCluster(e.target.value === '' ? undefined : Number(e.target.value))}
            className="text-xs px-3 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 font-medium"
          >
            <option value="">All Segments</option>
            <option value="0">Cluster 1: Budget-Conscious</option>
            <option value="1">Cluster 2: Trendsetters</option>
            <option value="2">Cluster 3: Mainstream</option>
            <option value="3">Cluster 4: Careful Spenders</option>
            <option value="4">Cluster 5: VIP Elite</option>
          </select>

          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" /> Retrieve & Generate
          </button>
        </form>

        {/* Preset chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase">Suggested Inquiries:</span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(p.text, p.cluster)}
              className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200 font-medium transition-colors cursor-pointer"
            >
              {p.text}
            </button>
          ))}
        </div>
      </div>

      {/* Main RAG Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retrieved Knowledge Base Chunks (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" /> Retrieved Context Chunks ({result.matchedDocs.length})
            </h3>
            <span className="text-[11px] text-gray-500 font-medium">Ranked by Vector Relevance</span>
          </div>

          <div className="space-y-3">
            {result.matchedDocs.map((item, idx) => (
              <div 
                key={item.doc.id}
                className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs hover:border-purple-300 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
                    {item.doc.id}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    Score: {item.score}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-gray-900 leading-snug">{item.doc.title}</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed">{item.doc.content}</p>

                <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                  {item.matchedKeywords.map((kw, kIdx) => (
                    <span key={kIdx} className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesized AI Strategy (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">AI Synthesized Strategic Recommendation</h3>
                <p className="text-[11px] text-gray-500">Formulated from retrieved evidence & customer segment characteristics</p>
              </div>
            </div>
          </div>

          {/* Generated Plan Box */}
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-sans text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-purple-300 text-sm">
                {result.recommendedCampaign.campaignName}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 text-[10px] font-semibold border border-purple-700/50">
                {result.recommendedCampaign.targetSegment}
              </span>
            </div>

            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">Strategic Objective:</span>
              <p className="text-slate-200 mt-0.5">{result.recommendedCampaign.objective}</p>
            </div>

            <div>
              <span className="text-gray-400 font-bold uppercase text-[10px]">AI Strategic Synthesis:</span>
              <p className="text-slate-300 mt-1 whitespace-pre-line leading-relaxed">
                {result.generatedStrategy}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-gray-400 font-bold uppercase text-[10px]">Expected Financial / Retention Metric:</span>
              <p className="text-emerald-400 font-semibold mt-0.5">{result.recommendedCampaign.kpis}</p>
            </div>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong>Grounding Guarantee:</strong> This recommendation is strictly grounded in verified retail research chunks from the knowledge base, preventing LLM hallucination.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
