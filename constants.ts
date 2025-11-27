import { Category, InventoryItem } from './types';

export const INITIAL_INVENTORY: InventoryItem[] = [
  // 內臟
  { id: '1', category: Category.INTERNAL_ORGANS, name: '生腸', unit: '包', quantity: 0, lastUpdated: Date.now() },
  { id: '2', category: Category.INTERNAL_ORGANS, name: '蛋黃', unit: '包', quantity: 0, lastUpdated: Date.now() },
  { id: '3', category: Category.INTERNAL_ORGANS, name: '雞胗', unit: '包', quantity: 0, lastUpdated: Date.now() },
  { id: '4', category: Category.INTERNAL_ORGANS, name: '雞心', unit: '包', quantity: 0, lastUpdated: Date.now() },
  
  // 滷味
  { id: '5', category: Category.BRAISED_DISHES, name: '豬耳朵', unit: '包', quantity: 0, lastUpdated: Date.now() },
  { id: '6', category: Category.BRAISED_DISHES, name: '鳳爪', unit: '包', quantity: 0, lastUpdated: Date.now() },
  { id: '7', category: Category.BRAISED_DISHES, name: '海帶芽', unit: '包', quantity: 0, lastUpdated: Date.now() },
  
  // 耗材
  { id: '8', category: Category.CONSUMABLES, name: '大盒', unit: '條', quantity: 0, lastUpdated: Date.now() },
  { id: '9', category: Category.CONSUMABLES, name: '中盒', unit: '條', quantity: 0, lastUpdated: Date.now() },
  { id: '10', category: Category.CONSUMABLES, name: '小盒', unit: '條', quantity: 0, lastUpdated: Date.now() },
  { id: '11', category: Category.CONSUMABLES, name: '竹籤', unit: '包', quantity: 0, lastUpdated: Date.now() },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.INTERNAL_ORGANS]: 'bg-rose-100 text-rose-800 border-rose-200',
  [Category.BRAISED_DISHES]: 'bg-amber-100 text-amber-800 border-amber-200',
  [Category.CONSUMABLES]: 'bg-slate-100 text-slate-800 border-slate-200',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  [Category.INTERNAL_ORGANS]: '🥩 內臟類',
  [Category.BRAISED_DISHES]: '🥘 滷味類',
  [Category.CONSUMABLES]: '🥡 耗材類',
};
