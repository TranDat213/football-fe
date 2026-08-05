interface SubField {
  id: string;
  name: string;
  type?: string;
}

interface Prop {
  subFields: SubField[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SubFieldLayoutMap({ subFields, selectedId, onSelect }: Prop) {
  return (
    <div className="rounded-lg border p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">Sơ đồ vị trí sân</p>
      <div className="flex flex-wrap gap-3 rounded-md bg-green-50 p-3">
        {subFields.map((sf) => {
          const isSelected = sf.id === selectedId;
          return (
            <button
              key={sf.id}
              onClick={() => onSelect(sf.id)}
              className={`flex w-[92px] flex-col items-center gap-1.5 rounded-md border-2 bg-white p-2 transition
                ${
                  isSelected
                    ? 'border-green-600 shadow-sm ring-1 ring-green-600/20'
                    : 'border-transparent hover:border-green-300'
                }`}
            >
              <svg viewBox="0 0 160 260" className="w-full">
                <rect x="10" y="10" width="28" height="220" fill="#439048" />
                <rect x="38" y="10" width="28" height="220" fill="#4a9d54" />
                <rect x="66" y="10" width="28" height="220" fill="#439048" />
                <rect x="94" y="10" width="28" height="220" fill="#4a9d54" />
                <rect x="122" y="10" width="28" height="220" fill="#439048" />
                <rect x="10" y="10" width="140" height="220" fill="none" stroke="#fff" strokeWidth="2" rx="3" />
                <line x1="10" y1="120" x2="150" y2="120" stroke="#fff" strokeWidth="1.5" />
                <circle cx="80" cy="120" r="18" fill="none" stroke="#fff" strokeWidth="1.5" />
                <circle cx="80" cy="120" r="2" fill="#fff" />
                <rect x="40" y="10" width="80" height="30" fill="none" stroke="#fff" strokeWidth="1.5" />
                <rect x="40" y="190" width="80" height="30" fill="none" stroke="#fff" strokeWidth="1.5" />
                <rect x="65" y="4" width="30" height="6" fill="#fff" />
                <rect x="65" y="250" width="30" height="6" fill="#fff" />
              </svg>
              <span
                className={`text-sm font-medium ${isSelected ? 'text-green-700' : 'text-gray-600'}`}
              >
                {sf.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}