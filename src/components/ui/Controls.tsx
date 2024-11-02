import { useBuilding } from '../../hooks/useBuilding';

export function Controls() {
  const { 
    buildingType, 
    floors, 
    hasBasement,
    useDimensions,
    width,
    depth,
    surfaceArea,
    setBuildingType, 
    setFloors,
    setHasBasement,
    setUseDimensions,
    setWidth,
    setDepth,
    setSurfaceArea
  } = useBuilding();

  return (
    <div className="absolute top-4 left-4 z-10 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg space-y-4 max-w-xs">
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Building Type</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setBuildingType('apartment')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              buildingType === 'apartment'
                ? 'bg-blue-600 text-white shadow-inner'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Apartment
          </button>
          <button
            onClick={() => setBuildingType('house')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              buildingType === 'house'
                ? 'bg-blue-600 text-white shadow-inner'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            House
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Building Size</h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useDimensions}
              onChange={(e) => setUseDimensions(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Use dimensions</span>
          </label>
        </div>
        
        {useDimensions ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="block text-sm text-gray-600">Width (m)</label>
              <input
                type="number"
                min="5"
                max="20"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm text-gray-600">Depth (m)</label>
              <input
                type="number"
                min="5"
                max="15"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              Surface area: {Math.round(width * depth)} m²
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">Surface Area (m²)</label>
            <input
              type="number"
              min="25"
              max="300"
              value={surfaceArea}
              onChange={(e) => setSurfaceArea(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-700">Floor Count</h2>
        <div className="flex items-center space-x-2">
          <input
            type="range"
            min="1"
            max="10"
            value={floors}
            onChange={(e) => setFloors(parseInt(e.target.value))}
            className="w-32 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700 min-w-[2rem]">
            {floors}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={hasBasement}
            onChange={(e) => setHasBasement(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Include Basement</span>
        </label>
      </div>

      <div className="pt-2 text-xs text-gray-500">
        Use mouse/touch to orbit • Scroll/pinch to zoom
      </div>
    </div>
  );
}