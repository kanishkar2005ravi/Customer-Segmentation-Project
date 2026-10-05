import React from 'react';
import { 
  Users, 
  Layers, 
  Sparkles, 
  BarChart3, 
  FileSpreadsheet, 
  BrainCircuit, 
  Award,
  Bot
} from 'lucide-react';

interface MallHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  datasetCount: number;
}

export const MallHeader: React.FC<MallHeaderProps> = ({ activeTab, setActiveTab, datasetCount }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'dataset', label: 'Dataset Profile', icon: FileSpreadsheet },
    { id: 'clustering', label: 'Clustering Studio', icon: Layers },
    { id: 'predictor', label: 'Predict Segment', icon: Sparkles },
    { id: 'personas', label: 'Customer Personas', icon: Users },
    { id: 'rag', label: 'RAG Marketing AI', icon: Bot },
    { id: 'models', label: 'Model Registry', icon: BrainCircuit },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">MallSegment AI</h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                  ML + RAG
                </span>
              </div>
              <p className="text-xs text-gray-500">Customer Segmentation & Precision Marketing Intelligence</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Dataset: {datasetCount} Shoppers</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-xs font-medium text-purple-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Optimal K = 5 Clusters</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-xs font-medium text-indigo-700">
              <Bot className="w-3.5 h-3.5" />
              <span>RAG Engine Online</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto scrollbar-none pb-2 pt-1 border-t border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
