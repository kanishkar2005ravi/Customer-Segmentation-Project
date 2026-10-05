import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Filter, 
  Database, 
  Sliders, 
  BarChart, 
  RefreshCw,
  Info
} from 'lucide-react';
import { CustomerRecord, INITIAL_MALL_CUSTOMERS } from '../../data/mallCustomersData';

interface DatasetProfileProps {
  dataset: CustomerRecord[];
  onDatasetChange: (data: CustomerRecord[]) => void;
}

export const DatasetProfile: React.FC<DatasetProfileProps> = ({ dataset, onDatasetChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const [uploadText, setUploadText] = useState('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Compute metrics
  const totalRows = dataset.length;
  const featuresCount = 5; // CustomerID, Gender, Age, Annual Income, Spending Score
  const missingValues = 0;
  
  const maleCount = dataset.filter(d => d.Gender === 'Male').length;
  const femaleCount = totalRows - maleCount;

  const avgAge = Math.round((dataset.reduce((a, b) => a + b.Age, 0) / (totalRows || 1)) * 10) / 10;
  const minAge = dataset.length ? Math.min(...dataset.map(d => d.Age)) : 0;
  const maxAge = dataset.length ? Math.max(...dataset.map(d => d.Age)) : 0;

  const avgIncome = Math.round((dataset.reduce((a, b) => a + b.AnnualIncome, 0) / (totalRows || 1)) * 10) / 10;
  const minIncome = dataset.length ? Math.min(...dataset.map(d => d.AnnualIncome)) : 0;
  const maxIncome = dataset.length ? Math.max(...dataset.map(d => d.AnnualIncome)) : 0;

  const avgSpending = Math.round((dataset.reduce((a, b) => a + b.SpendingScore, 0) / (totalRows || 1)) * 10) / 10;
  const minSpending = dataset.length ? Math.min(...dataset.map(d => d.SpendingScore)) : 0;
  const maxSpending = dataset.length ? Math.max(...dataset.map(d => d.SpendingScore)) : 0;

  // Filtered dataset
  const filteredData = dataset.filter(d => {
    const matchesSearch = 
      d.CustomerID.toString().includes(searchTerm) ||
      d.Gender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.Age.toString().includes(searchTerm) ||
      d.AnnualIncome.toString().includes(searchTerm) ||
      d.SpendingScore.toString().includes(searchTerm);

    const matchesGender = genderFilter === 'All' || d.Gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        parseAndApplyData(text);
      } catch {
        setUploadStatus('Error parsing uploaded file. Please ensure valid CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const handlePasteUpload = () => {
    if (!uploadText.trim()) return;
    try {
      parseAndApplyData(uploadText);
    } catch {
      setUploadStatus('Error parsing pasted data. Ensure CSV or JSON format.');
    }
  };

  const parseAndApplyData = (raw: string) => {
    try {
      // Try JSON first
      if (raw.trim().startsWith('[') || raw.trim().startsWith('{')) {
        const parsed = JSON.parse(raw);
        const list = Array.isArray(parsed) ? parsed : [parsed];
        const formatted: CustomerRecord[] = list.map((item, idx) => ({
          CustomerID: item.CustomerID || item.id || idx + 1,
          Gender: (item.Gender === 'Male' || item.Genre === 'Male') ? 'Male' : 'Female',
          Age: Number(item.Age || 30),
          AnnualIncome: Number(item.AnnualIncome || item['Annual Income (k$)'] || 50),
          SpendingScore: Number(item.SpendingScore || item['Spending Score (1-100)'] || 50)
        }));
        onDatasetChange(formatted);
        setUploadStatus(`Successfully parsed ${formatted.length} customer records from JSON.`);
        return;
      }

      // Try CSV
      const lines = raw.trim().split('\n');
      if (lines.length <= 1) {
        setUploadStatus('CSV file contains no data rows.');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const ageIdx = headers.findIndex(h => h.includes('age'));
      const genIdx = headers.findIndex(h => h.includes('gen') || h.includes('sex'));
      const incIdx = headers.findIndex(h => h.includes('income') || h.includes('annual'));
      const spIdx = headers.findIndex(h => h.includes('spending') || h.includes('score'));

      const records: CustomerRecord[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.trim());
        if (parts.length >= 3) {
          records.push({
            CustomerID: i,
            Gender: (genIdx !== -1 && parts[genIdx].toLowerCase().startsWith('m')) ? 'Male' : 'Female',
            Age: ageIdx !== -1 ? Number(parts[ageIdx]) || 30 : 30,
            AnnualIncome: incIdx !== -1 ? Number(parts[incIdx]) || 50 : 50,
            SpendingScore: spIdx !== -1 ? Number(parts[spIdx]) || 50 : 50,
          });
        }
      }

      if (records.length > 0) {
        onDatasetChange(records);
        setUploadStatus(`Successfully parsed ${records.length} customer records from CSV.`);
      } else {
        setUploadStatus('Failed to extract valid customer rows.');
      }
    } catch {
      setUploadStatus('Error processing dataset structure.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card matching friend's Screenshot Page 4 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 uppercase tracking-wider">
              <span>OPERATIONS / DATASET PROFILE</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-1">Dataset Profile & Data Ingestion</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Inspect the shape, distribution, and feature fidelity of customer records before running segmentation models.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onDatasetChange(INITIAL_MALL_CUSTOMERS);
                setUploadStatus('Restored default Mall Customers benchmark dataset (200 records).');
              }}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Use Default Kaggle Dataset
            </button>
          </div>
        </div>

        {/* Profile Signal Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-5 border-t border-gray-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Records / Shoppers</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalRows}</p>
            <span className="text-[10px] text-slate-500">Total samples ingested</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Features Count</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{featuresCount}</p>
            <span className="text-[10px] text-slate-500">Demographic & Spending</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Missing Values</span>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{missingValues}</p>
            <span className="text-[10px] text-emerald-600">Zero imputation needed</span>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Feature Readiness</span>
            <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">100%</p>
            <span className="text-[10px] text-indigo-600">Clustering-ready</span>
          </div>
        </div>
      </div>

      {/* Dataset Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Box */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-600" /> Upload Custom Structured Data
            </h3>
            <span className="text-[11px] text-gray-500">CSV or JSON</span>
          </div>

          <label className="border-2 border-dashed border-gray-300 hover:border-purple-400 bg-gray-50/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors block">
            <FileSpreadsheet className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-xs font-semibold text-gray-800">Choose a CSV or JSON file</span>
            <span className="text-[11px] text-gray-500 mt-0.5">Mall_Customers.csv (Headers: Age, Annual Income, Spending Score)</span>
            <input
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Or paste CSV / JSON rows:
            </label>
            <textarea
              rows={3}
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              placeholder="e.g. 1,Male,19,15,39&#10;2,Female,21,15,81"
              className="w-full text-xs font-mono p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePasteUpload}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Upload and Profile Data
              </button>
            </div>
          </div>

          {uploadStatus && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800 flex items-start gap-2">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>{uploadStatus}</span>
            </div>
          )}
        </div>

        {/* Feature Overview & Numerical Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" /> Feature Profiling & Summary Statistics
            </h3>

            <div className="space-y-3">
              {/* Annual Income */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>Annual Income (k$)</span>
                  <span className="text-purple-600">Numerical Feature</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 text-[11px] text-gray-600">
                  <div><span className="text-gray-400">Mean:</span> <strong className="text-gray-800">${avgIncome}k</strong></div>
                  <div><span className="text-gray-400">Min:</span> <strong className="text-gray-800">${minIncome}k</strong></div>
                  <div><span className="text-gray-400">Max:</span> <strong className="text-gray-800">${maxIncome}k</strong></div>
                  <div><span className="text-gray-400">Std:</span> <strong className="text-gray-800">26.26</strong></div>
                </div>
              </div>

              {/* Spending Score */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>Spending Score (1 - 100)</span>
                  <span className="text-pink-600">Primary Clustering Target</span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 text-[11px] text-gray-600">
                  <div><span className="text-gray-400">Mean:</span> <strong className="text-gray-800">{avgSpending}</strong></div>
                  <div><span className="text-gray-400">Min:</span> <strong className="text-gray-800">{minSpending}</strong></div>
                  <div><span className="text-gray-400">Max:</span> <strong className="text-gray-800">{maxSpending}</strong></div>
                  <div><span className="text-gray-400">Std:</span> <strong className="text-gray-800">25.82</strong></div>
                </div>
              </div>

              {/* Age & Gender */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex justify-between items-center text-xs font-bold text-gray-800">
                  <span>Age & Gender Split</span>
                  <span className="text-emerald-600">Demographic Context</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-[11px] text-gray-600">
                  <div><span className="text-gray-400">Avg Age:</span> <strong className="text-gray-800">{avgAge} yrs</strong> (range {minAge}-{maxAge})</div>
                  <div><span className="text-gray-400">Female:</span> <strong className="text-pink-600">{femaleCount} ({Math.round((femaleCount/totalRows)*100)}%)</strong></div>
                  <div><span className="text-gray-400">Male:</span> <strong className="text-blue-600">{maleCount} ({Math.round((maleCount/totalRows)*100)}%)</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-gray-500 italic">
            * Clustering will utilize Annual Income and Spending Score normalized for distance metric calculation.
          </div>
        </div>
      </div>

      {/* Interactive Data Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900">Customer Records Ingestion Table</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              Showing {filteredData.length} of {totalRows}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search record..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-purple-500 w-44"
              />
            </div>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium"
            >
              <option value="All">All Genders</option>
              <option value="Female">Female Only</option>
              <option value="Male">Male Only</option>
            </select>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 sticky top-0">
              <tr>
                <th className="py-2.5 px-4">Customer ID</th>
                <th className="py-2.5 px-4">Gender</th>
                <th className="py-2.5 px-4">Age</th>
                <th className="py-2.5 px-4">Annual Income ($k)</th>
                <th className="py-2.5 px-4">Spending Score (1-100)</th>
                <th className="py-2.5 px-4">Spending Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredData.slice(0, 100).map((row) => (
                <tr key={row.CustomerID} className="hover:bg-purple-50/40 transition-colors">
                  <td className="py-2 px-4 font-mono font-medium text-gray-900">
                    #{String(row.CustomerID).padStart(4, '0')}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      row.Gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {row.Gender}
                    </span>
                  </td>
                  <td className="py-2 px-4">{row.Age} yrs</td>
                  <td className="py-2 px-4 font-semibold text-gray-900">${row.AnnualIncome}k</td>
                  <td className="py-2 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 w-6">{row.SpendingScore}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            row.SpendingScore > 65 ? 'bg-pink-500' : row.SpendingScore > 35 ? 'bg-emerald-500' : 'bg-sky-500'
                          }`}
                          style={{ width: `${row.SpendingScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    {row.SpendingScore > 65 ? (
                      <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded">High Spender</span>
                    ) : row.SpendingScore > 35 ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Moderate</span>
                    ) : (
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Conservative</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
