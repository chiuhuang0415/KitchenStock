export enum Category {
  INTERNAL_ORGANS = '內臟',
  BRAISED_DISHES = '滷味',
  CONSUMABLES = '耗材',
}

export interface InventoryItem {
  id: string;
  category: Category;
  name: string;
  unit: string;
  quantity: number;
  lastUpdated: number; // Timestamp
}

export interface AiAnalysisResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  content: string;
}
