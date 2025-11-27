import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  unit: string;
  onUpdate: (newQuantity: number) => void;
}

const QuantityControl: React.FC<QuantityControlProps> = ({ quantity, unit, onUpdate }) => {
  return (
    <div className="flex items-center space-x-3 bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
      <button
        onClick={() => onUpdate(Math.max(0, quantity - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-red-500 active:scale-95 transition-all"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      
      <div className="flex flex-col items-center w-16">
        <span className="text-xl font-bold text-gray-800 tabular-nums leading-none">
          {quantity}
        </span>
        <span className="text-xs text-gray-400 font-medium">{unit}</span>
      </div>

      <button
        onClick={() => onUpdate(quantity + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-green-600 active:scale-95 transition-all"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantityControl;
