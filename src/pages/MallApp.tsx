import React, { useState } from 'react';
import { MallHeader } from '../components/mall/MallHeader';
import { MallOverview } from '../components/mall/MallOverview';
import { DatasetProfile } from '../components/mall/DatasetProfile';
import { ClusteringStudio } from '../components/mall/ClusteringStudio';
import { CustomerPredictor } from '../components/mall/CustomerPredictor';
import { PersonaExplorer } from '../components/mall/PersonaExplorer';
import { RagMarketingHub } from '../components/mall/RagMarketingHub';
import { ModelRegistry } from '../components/mall/ModelRegistry';
import { INITIAL_MALL_CUSTOMERS, CustomerRecord } from '../data/mallCustomersData';
import { runKMeansClustering, ClusteringResult } from '../services/clusteringEngine';

export const MallApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dataset, setDataset] = useState<CustomerRecord[]>(INITIAL_MALL_CUSTOMERS);
  const [clusteringResult, setClusteringResult] = useState<ClusteringResult>(() => 
    runKMeansClustering(INITIAL_MALL_CUSTOMERS, 5)
  );
  const [ragClusterId, setRagClusterId] = useState<number | undefined>(4);

  const handleDatasetChange = (newData: CustomerRecord[]) => {
    setDataset(newData);
    const result = runKMeansClustering(newData, clusteringResult.k || 5);
    setClusteringResult(result);
  };

  const handleClusteringUpdate = (newResult: ClusteringResult) => {
    setClusteringResult(newResult);
  };

  const handleSelectClusterForRag = (clusterId: number) => {
    setRagClusterId(clusterId);
    setActiveTab('rag');
  };

  const handleResetDemo = () => {
    setDataset(INITIAL_MALL_CUSTOMERS);
    const result = runKMeansClustering(INITIAL_MALL_CUSTOMERS, 5);
    setClusteringResult(result);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <MallHeader 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        datasetCount={dataset.length} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <MallOverview 
            clusteringResult={clusteringResult}
            onNavigate={(tab) => setActiveTab(tab)}
            onLoadDemo={handleResetDemo}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetProfile 
            dataset={dataset}
            onDatasetChange={handleDatasetChange}
          />
        )}

        {activeTab === 'clustering' && (
          <ClusteringStudio 
            dataset={dataset}
            currentResult={clusteringResult}
            onClusteringUpdate={handleClusteringUpdate}
          />
        )}

        {activeTab === 'predictor' && (
          <CustomerPredictor 
            clusteringResult={clusteringResult}
            onNavigateToRag={() => setActiveTab('rag')}
          />
        )}

        {activeTab === 'personas' && (
          <PersonaExplorer 
            clusteringResult={clusteringResult}
            onSelectClusterForRag={handleSelectClusterForRag}
          />
        )}

        {activeTab === 'rag' && (
          <RagMarketingHub 
            initialClusterId={ragClusterId}
          />
        )}

        {activeTab === 'models' && (
          <ModelRegistry />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-500">
        <p>Mall Customer Segmentation & RAG Marketing System • Machine Learning Mini Project</p>
      </footer>
    </div>
  );
};
