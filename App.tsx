import React, { useState, useEffect, useCallback } from 'react';
import KitchenStock from './components/KitchenStock';
import './App.css';

// 庫存項目的 TypeScript 介面
interface InventoryItem {
  id: number;
  '名稱': string;
  '數量': number;
  '單位': string;
}

// *** 您的 Apps Script Web App URL - 這是您剛剛部署成功的網址！***
const API_URL = 'https://script.google.com/macros/s/AKfycbzrWd6NXyNq9X1Y4VDIu3GuQDAOt4R6YddfAYr8gJjNWPu7CABb-NPoljAYVqXNgiHx/exec';

// 客製化 Hook：用於初次載入資料
// 它會在組件載入時，或當 items 列表需要重新整理時，從 Apps Script API 獲取資料。
const useInitialLoad = (setItems: (items: InventoryItem[]) => void, shouldReload: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      // 確保每次載入都將 loading 設為 true
      setIsLoading(true); 
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          // 確保 CORS 和快取設定正確
          cache: 'no-cache', 
        });

        if (!response.ok) {
          throw new Error(`HTTP 錯誤! 狀態碼: ${response.status}`);
        }

        const result = await response.json();
        
        // 檢查 Apps Script 回傳的狀態
        if (result.status === 200) {
          // 確保數量是數字類型
          const processedData: InventoryItem[] = (result.data || []).map((item: any, index: number) => ({
            id: item.id || index + 1, // 使用後端 ID，如果沒有則使用索引
            '名稱': item['名稱'] || '',
            '數量': Number(item['數量']) || 0, // 將數量轉換為數字，以便在前端計算
            '單位': item['單位'] || '',
          }));
          setItems(processedData);
          setError(null);
        } else {
          setError(`API 錯誤: ${result.message}`);
        }
      } catch (e) {
        if (e instanceof Error) {
            console.error("載入庫存資料失敗:", e.message);
            setError("無法連線到資料庫或載入資料。請檢查網路和 API 部署狀態。錯誤詳情: " + e.message);
        } else {
            setError("發生未知錯誤。");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [setItems, shouldReload]); // 依賴 shouldReload，當它改變時重新執行

  return { isLoading, error };
};

const App: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  // 增加一個 state 來控制是否需要重新載入資料
  const [shouldReload, setShouldReload] = useState(false); 
  
  // 重新載入資料的函式，通過改變 shouldReload 的狀態來觸發 useInitialLoad
  const reloadData = useCallback(() => {
    setShouldReload(prev => !prev);
  }, []);

  // 呼叫 Hook 來處理資料載入
  const { isLoading, error } = useInitialLoad(setItems, shouldReload); 

  // 新增項目到 Google 試算表
  const addItem = useCallback(async (newItem: Omit<InventoryItem, 'id'>) => {
    // Apps Script API 只需要新增項目的資料，並且欄位名稱必須與試算表標題一致 ('名稱', '數量', '單位')
    const itemToSend = {
      '名稱': newItem['名稱'],
      '數量': newItem['數量'].toString(), // 傳送給 Apps Script 時，數字需要轉換為字串
      '單位': newItem['單位']
    };

    try {
      // 發送 POST 請求到 Apps Script API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemToSend),
      });

      if (!response.ok) {
        throw new Error('新增項目 HTTP 錯誤');
      }

      const result = await response.json();

      if (result.status === 200) {
        console.log("新增成功:", result.data);
        // 新增成功後，觸發重新載入，讓前端顯示最新資料
        reloadData(); 
      } else {
        alert(`新增失敗: ${result.message}`);
      }
    } catch (e) {
      console.error("新增項目失敗:", e);
      alert("無法新增項目。請檢查 API 連線。");
    }
  }, [reloadData]);
  
  // 簡化載入和錯誤狀態的顯示
  const displayLoading = isLoading; 
  const displayError = error;

  if (displayLoading) {
    return (
      <div className="App">
        <h1>廚房庫存管理</h1>
        <div className="loading">資料載入中...</div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="App">
        <h1>廚房庫存管理</h1>
        <div className="error-message">錯誤: {displayError}</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>廚房庫存管理</h1>
      </header>
      {/* 將庫存資料和新增函式傳遞給子組件 */}
      <KitchenStock items={items} onAddItem={addItem} />
    </div>
  );
};

export default App;
