import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { COMPONENT_CATALOG, getComponentsByCategory } from '../../game/database/components';
import { ComponentCategory, SpacecraftComponent } from '../../types/game';
import { SpacecraftCanvas } from '../../three/SpacecraftCanvas';
import { ResourceHUD } from '../../components/dashboards/ResourceHUD';
import { 
  Plus, 
  Trash2, 
  Info, 
  Layers, 
  Zap, 
  Fuel, 
  Radio, 
  Camera, 
  Cpu, 
  Thermometer, 
  HardDrive, 
  Box, 
  ChevronRight,
  ShieldCheck,
  RotateCw,
  Search
} from 'lucide-react';

export const SpacecraftBuilder: React.FC = () => {
  const { 
    components, 
    addComponent, 
    removeComponent, 
    clearComponents,
    selectedComponentId, 
    setSelectedComponentId,
    hoveredComponentId,
    setHoveredComponentId,
    setScreen,
    mission
  } = useGame();

  const [activeCategory, setActiveCategory] = useState<ComponentCategory>('structure');
  const [searchFilter, setSearchFilter] = useState('');

  const categories: { id: ComponentCategory; name: string; icon: React.ReactNode }[] = [
    { id: 'structure', name: 'Structure', icon: <Box className="w-4 h-4" /> },
    { id: 'power', name: 'Power', icon: <Zap className="w-4 h-4" /> },
    { id: 'propulsion', name: 'Propulsion', icon: <Fuel className="w-4 h-4" /> },
    { id: 'communication', name: 'Comms', icon: <Radio className="w-4 h-4" /> },
    { id: 'science', name: 'Science', icon: <Camera className="w-4 h-4" /> },
    { id: 'computing', name: 'Computing', icon: <Cpu className="w-4 h-4" /> },
    { id: 'thermal', name: 'Thermal', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'storage', name: 'Storage', icon: <HardDrive className="w-4 h-4" /> }
  ];

  const availableComponents = getComponentsByCategory(activeCategory).filter(c =>
    c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const selectedComp = components.find(c => c.id === selectedComponentId);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-space-950 select-none">
      {/* Live Resource Management HUD */}
      <ResourceHUD />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Component Catalog Drawer */}
        <div className="w-full lg:w-96 bg-space-900 border-r border-slate-800 flex flex-col z-10 flex-shrink-0">
          {/* Category Tabs */}
          <div className="grid grid-cols-4 gap-1 p-2 bg-space-950/80 border-b border-slate-800">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-center space-x-1 py-2 px-1 rounded text-xs font-tech tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {cat.icon}
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={`Search ${activeCategory} components...`}
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-space-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Available Components List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {availableComponents.map((comp) => {
              const isAlreadyMounted = components.some(c => c.id === comp.id);
              return (
                <div
                  key={comp.id}
                  onMouseEnter={() => setHoveredComponentId(comp.id)}
                  onMouseLeave={() => setHoveredComponentId(null)}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isAlreadyMounted
                      ? 'bg-space-950/90 border-cyan-500/40'
                      : 'bg-space-950/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="font-tech text-sm font-bold text-slate-100 tracking-wider uppercase">
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                        {comp.description}
                      </p>
                    </div>
                  </div>

                  {/* Component Specs Matrix */}
                  <div className="grid grid-cols-3 gap-1.5 py-2 my-2 border-y border-slate-800/60 text-[10px] font-mono text-slate-300">
                    <div>
                      <span className="text-slate-500">MASS:</span> {comp.mass} kg
                    </div>
                    <div>
                      <span className="text-slate-500">COST:</span> ${(comp.cost / 1000).toFixed(1)}M
                    </div>
                    <div>
                      <span className="text-slate-500">POWER:</span>{' '}
                      {comp.powerGen > 0 ? (
                        <span className="text-emerald-400">+{comp.powerGen}W</span>
                      ) : (
                        <span className="text-amber-400">-{comp.powerDraw}W</span>
                      )}
                    </div>
                    {comp.dataGen > 0 && (
                      <div>
                        <span className="text-slate-500">DATA:</span> {comp.dataGen} Mbps
                      </div>
                    )}
                    {comp.dataStorage > 0 && (
                      <div>
                        <span className="text-slate-500">STORAGE:</span> {comp.dataStorage} GB
                      </div>
                    )}
                    {comp.isp && (
                      <div>
                        <span className="text-slate-500">ISP:</span> {comp.isp} s
                      </div>
                    )}
                    {comp.propellantMass && (
                      <div>
                        <span className="text-slate-500">FUEL:</span> {comp.propellantMass} kg
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500">REL:</span> {Math.round(comp.reliability * 100)}%
                    </div>
                  </div>

                  {/* Add / Mounted Button */}
                  <div className="flex items-center justify-between mt-2">
                    {isAlreadyMounted ? (
                      <div className="flex items-center space-x-2 w-full justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>MOUNTED ON BUS</span>
                        </span>
                        <button
                          onClick={() => removeComponent(comp.id)}
                          className="px-2 py-1 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded text-[10px] font-mono transition-colors flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>DETACH</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addComponent(comp)}
                        className="w-full py-1.5 bg-cyan-600/30 hover:bg-cyan-600 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 hover:text-white rounded text-xs font-tech font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ATTACH TO CAD FRAME</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Interactive 3D Spacecraft Canvas */}
        <div className="flex-1 h-full relative overflow-hidden bg-space-950">
          <SpacecraftCanvas
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            hoveredComponentId={hoveredComponentId}
            onHoverComponent={setHoveredComponentId}
            cameraDistance={4.5}
          />

          {/* Floating Action Controls on Viewport */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
            <button
              onClick={() => clearComponents()}
              className="bg-space-900/80 hover:bg-red-950/60 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-300 px-3 py-1.5 rounded text-xs font-mono transition-colors flex items-center space-x-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>RESET CAD</span>
            </button>
            <button
              onClick={() => setScreen('mission-configuration')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-tech font-bold px-4 py-1.5 rounded tracking-wider uppercase flex items-center space-x-1.5 transition-all shadow-hud"
            >
              <span>CONFIGURE TRAJECTORY</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: Mounted Component Stack & Inspector */}
        <div className="w-full lg:w-80 bg-space-900 border-l border-slate-800 flex flex-col z-10 flex-shrink-0">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-space-950/60">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="font-tech text-sm font-bold text-slate-100 uppercase tracking-wider">
                MOUNTED HARDWARE ({components.length})
              </h3>
            </div>
          </div>

          {/* Component Hierarchy Tree */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {components.map((comp) => {
              const isSelected = selectedComponentId === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponentId(comp.id)}
                  className={`p-2.5 rounded border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-sm'
                      : 'bg-space-950/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tech text-xs font-bold text-slate-200 uppercase truncate">
                      {comp.name}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(comp.id);
                      }}
                      className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>{comp.mass} kg</span>
                    <span>${(comp.cost / 1000).toFixed(1)}M</span>
                    <span className={comp.powerGen > 0 ? 'text-emerald-400' : 'text-slate-400'}>
                      {comp.powerGen > 0 ? `+${comp.powerGen}W` : `-${comp.powerDraw}W`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Inspector Box */}
          {selectedComp ? (
            <div className="p-4 border-t border-slate-800 bg-space-950">
              <div className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 uppercase mb-1">
                <Info className="w-3.5 h-3.5" />
                <span>INSPECTOR: {selectedComp.category}</span>
              </div>
              <h4 className="font-tech font-bold text-sm text-slate-100 uppercase mb-1">
                {selectedComp.name}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                {selectedComp.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300">
                <div>MASS: {selectedComp.mass} kg</div>
                <div>COST: ${(selectedComp.cost / 1000).toFixed(2)}M</div>
                <div>POWER: {selectedComp.powerGen > 0 ? `+${selectedComp.powerGen}W` : `-${selectedComp.powerDraw}W`}</div>
                <div>STORAGE: {selectedComp.dataStorage} GB</div>
                <div>RELIABILITY: {Math.round(selectedComp.reliability * 100)}%</div>
                <div>THERMAL: {selectedComp.thermalRating} W</div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-slate-800 bg-space-950 text-center text-xs font-mono text-slate-500">
              CLICK ANY COMPONENT IN 3D OR LIST TO INSPECT ATTRIBUTES
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
