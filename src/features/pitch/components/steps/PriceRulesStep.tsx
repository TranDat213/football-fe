import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function PriceRulesStep() {
  const { register, control, watch } = useFormContext<PitchFormData>();
  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({ control, name: 'priceRules' });
  const formValues = watch();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {priceFields.map((field: any, index: number) => (
        <div key={field.id} className="p-4 border border-gray-100 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 items-end bg-gray-50/50 relative">
          <div className="space-y-2 col-span-2 sm:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Apply to Yard</label>
            <select {...register(`priceRules.${index}.yardIndex`, { valueAsNumber: true })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white">
              {formValues.yards.map((y: any, yi: number) => (
                <option key={yi} value={yi}>{y.name || `Yard ${yi+1}`}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Start Time</label>
            <input type="time" {...register(`priceRules.${index}.startTime`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">End Time</label>
            <input type="time" {...register(`priceRules.${index}.endTime`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2 col-span-2 md:col-span-1">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Price</label>
            <input type="number" {...register(`priceRules.${index}.price`, { valueAsNumber: true })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <button type="button" onClick={() => removePrice(index)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => appendPrice({ yardIndex: 0, startTime: '06:00', endTime: '18:00', price: 100000 })} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" /> Add Price Rule
      </Button>
    </div>
  );
}
