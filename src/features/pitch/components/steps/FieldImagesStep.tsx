import { Camera } from 'lucide-react';

export default function FieldImagesStep() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <button type="button" className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all">
            <Camera className="h-6 w-6 text-gray-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Upload Photo</span>
          </button>
        </div>
        <p className="text-xs text-gray-400">Image upload simulated for UI preview.</p>
      </div>
    </div>
  );
}
