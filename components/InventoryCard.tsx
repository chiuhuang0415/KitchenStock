import React from 'react';
import { InventoryItem } from '../types';
import QuantityControl from './QuantityControl';
import { Package, AlertCircle } from 'lucide-react';

interface InventoryCardProps {
  item: InventoryItem;
  onUpdate: (id: string, quantity: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ item, onUpdate }) => {
  const isLowStock = item.quantity === 0;
  
  return (
    <div className={`
      relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200
      ${isLowStock ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}
    `}>
      <div className="flex items-center gap-3">
        <div className={`
          p-2 rounded-lg
          ${isLowStock ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}
        `}>
          {isLowStock ? <AlertCircle size={20} /> : <Package size={20} />}
        </div>
        <div>
          <h3 className={`font-bold text-lg ${isLowStock ? 'text-red-700' : 'text-gray-800'}`}>
            {item.name}
          </h3>
          {isLowStock && (
            <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
              缺貨中
            </span>
          )}
        </div>
      </div>

      <QuantityControl 
        quantity={item.quantity} 
        unit={item.unit} 
        onUpdate={(newQty) => onUpdate(item.id, newQty)} 
      />
    </div>
  );
};

export default InventoryCard;
