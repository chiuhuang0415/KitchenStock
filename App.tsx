import React, { useState, useEffect } from 'react';
import { Category, InventoryItem, AiAnalysisResult } from './types';
import { INITIAL_INVENTORY, CATEGORY_COLORS, CATEGORY_LABELS } from './constants';
import InventoryCard from './components/InventoryCard';
import { generateStockAnalysis } from './services/geminiService';
import { LayoutDashboard, Sparkles, RefreshCw, Save, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('kitchenStock_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [activeTab, setActiveTab] = useState<'inventory' | 'analysis'>('inventory');
  const [analysis, setAnalysis] = useState<AiAnalysisResult>({ status: 'idle', content: '' });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('kitchenStock_inventory', JSON.stringify(inventory));
  }, [inventory]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, lastUpdated: Date.now() } 
        : item
    ));
  };

  const handleReset = () => {
    if (confirm('確定要重置所有庫存數量為 0 嗎？此動作無法復原。')) {
      setInventory(INITIAL_INVENTORY.map(item => ({ ...item, quantity: 0, lastUpdated: Date.now() })));
    }
  };

  const handleAnalyze = async () => {
    setAnalysis({ status: 'loading', content: '' });
    setActiveTab('analysis');
    const result = await generateStockAnalysis(inventory);
    setAnalysis({ status: 'success', content: result });
  };

  // Group items by category
  const groupedInventory = inventory.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, InventoryItem[]>);

  // Render Markdown-like text simply (handling newlines and basic formatting)
  const renderAnalysisContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const isHeader = line.startsWith('#') || line.includes('：');
      const isListItem = line.trim().startsWith('-') || line.trim().startsWith('*') || /^\d+\./.test(line.trim());
      
      let className = "mb-2 text-gray-700";
      if (line.includes('[急缺]')) className = "mb-2 text-red-600 font-bold bg-red-50 p-2 rounded";
      else if (line.includes('[建議補貨]')) className = "mb-2 text-amber-600 font-medium";
      else if (isHeader) className = "mb-3 mt-4 text-lg font-bold text-gray-900 border-b pb-1";
      
      return <div key={i} className={className}>{line}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <LayoutDashboard size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">庫存小幫手</h1>
              <p className="text-xs text-gray-500">Kitchen Inventory Tracker</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={handleReset}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="重置所有庫存"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Navigation Tabs (Mobile optimized) */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all
              ${activeTab === 'inventory' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard size={18} />
            庫存盤點
          </button>
          <button
            onClick={() => activeTab === 'analysis' ? handleAnalyze() : setActiveTab('analysis')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all
              ${activeTab === 'analysis' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Sparkles size={18} />
            AI 智慧分析
          </button>
        </div>

        {activeTab === 'inventory' && (
          <div className="space-y-8 animate-fade-in">
            {Object.entries(groupedInventory).map(([category, items]) => (
              <section key={category} className="space-y-3">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border w-fit ${CATEGORY_COLORS[category as Category]}`}>
                  <h2 className="font-bold text-sm tracking-wide">
                    {CATEGORY_LABELS[category as Category]}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map(item => (
                    <InventoryCard 
                      key={item.id} 
                      item={item} 
                      onUpdate={handleUpdateQuantity} 
                    />
                  ))}
                </div>
              </section>
            ))}
            
            <div className="h-24 md:h-12"></div> {/* Spacer for floating button */}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in min-h-[50vh]">
            <div className="p-6 border-b border-gray-100 bg-indigo-50/50 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">智慧叫貨建議</h2>
                <p className="text-sm text-indigo-600/80 mt-1">AI 根據目前庫存量產生的報告</p>
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={analysis.status === 'loading'}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm text-sm font-medium"
              >
                {analysis.status === 'loading' ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} />
                    分析中...
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    重新分析
                  </>
                )}
              </button>
            </div>
            
            <div className="p-6">
              {analysis.status === 'idle' && (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles size={48} className="mx-auto mb-4 text-indigo-200" />
                  <p>點擊上方按鈕開始分析庫存</p>
                </div>
              )}
              
              {analysis.status === 'loading' && (
                <div className="space-y-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                  <div className="h-32 bg-gray-50 rounded-lg mt-6"></div>
                </div>
              )}

              {analysis.status === 'success' && (
                <div className="prose prose-indigo max-w-none">
                  {renderAnalysisContent(analysis.content)}
                </div>
              )}
              
              {analysis.status === 'error' && (
                <div className="text-center py-12 text-red-500 bg-red-50 rounded-xl">
                  <p>發生錯誤，請稍後再試。</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button for Inventory Save (Visual feedback only since it auto-saves) */}
      {activeTab === 'inventory' && (
        <div className="fixed bottom-6 right-6 md:hidden">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium opacity-90 backdrop-blur-sm">
            <Save size={16} />
            自動儲存中
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
