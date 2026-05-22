import React from 'react';

const METHOD_COLOR = {
  GET:    'bg-blue-100 text-blue-700',
  POST:   'bg-green-100 text-green-700',
  PUT:    'bg-amber-100 text-amber-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function DocsSidebar({ endpoints, selected, onSelect }) {
  const groups = endpoints.reduce((acc, ep) => {
    const group = ep.path.split('/')[2] || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(ep);
    return acc;
  }, {});

  return (
    <aside className="w-full lg:w-60 flex-shrink-0">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden sticky top-[90px]">
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reference</p>
        </div>
        <nav className="divide-y divide-gray-50 max-h-[75vh] overflow-y-auto">
          {Object.entries(groups).map(([group, eps]) => (
            <div key={group}>
              <div className="px-4 py-2 bg-gray-50/40">
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{group}</p>
              </div>
              {eps.map(ep => (
                <button
                  key={ep.id}
                  onClick={() => onSelect(ep)}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-[#635BFF]/5 ${
                    selected?.id === ep.id ? 'bg-[#635BFF]/8 border-r-2 border-[#635BFF]' : ''
                  }`}
                >
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${METHOD_COLOR[ep.method] || 'bg-gray-100 text-gray-600'}`}>
                    {ep.method}
                  </span>
                  <span className={`text-xs font-mono truncate ${selected?.id === ep.id ? 'text-[#635BFF] font-semibold' : 'text-[#425466]'}`}>
                    {ep.path}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}