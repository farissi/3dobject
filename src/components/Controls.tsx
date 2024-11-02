interface ControlsProps {
  buildingType: 'apartment' | 'house';
  floors: number;
  onBuildingTypeChange: (type: 'apartment' | 'house') => void;
  onFloorsChange: (floors: number) => void;
}

export function Controls({
  buildingType,
  floors,
  onBuildingTypeChange,
  onFloorsChange,
}: ControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-10 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg space-y-4">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Building Type</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onBuildingTypeChange('apartment')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              buildingType === 'apartment'
                ? 'bg-black text-white shadow-inner'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Apartment
          </button>
          <button
            onClick={() => onBuildingTypeChange('house')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              buildingType === 'house'
                ? 'bg-black text-white shadow-inner'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            House
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Floor Count</h2>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="10"
            value={floors}
            onChange={(e) => onFloorsChange(parseInt(e.target.value))}
            className="w-32 accent-black"
          />
          <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
            {floors}
          </span>
        </div>
      </div>

      <div className="pt-2 text-xs text-gray-500">
        Use mouse/touch to orbit • Scroll/pinch to zoom
      </div>
    </div>
  );
}