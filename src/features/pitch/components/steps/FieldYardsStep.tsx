import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function FieldYardsStep() {
  const { register, control, formState: { errors } } = useFormContext<PitchFormData>();
  const { fields: yardFields, append: appendYard, remove: removeYard } = useFieldArray({ control, name: 'yards' });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {yardFields.map((field: any, index: number) => (
        <div key={field.id} className="p-4 border border-gray-100 rounded-xl flex items-end gap-4 bg-gray-50/50 relative">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Yard Name</label>
            <input {...register(`yards.${index}.name`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors?.yards?.[index]?.name && <p className="text-red-500 text-[10px]">{errors.yards[index]?.name?.message}</p>}
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Yard Code</label>
            <input {...register(`yards.${index}.code`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors?.yards?.[index]?.code && <p className="text-red-500 text-[10px]">{errors.yards[index]?.code?.message}</p>}
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wide text-gray-500">Type</label>
            <select {...register(`yards.${index}.type` as const)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white">
              <option value="FIVE_A_SIDE">5v5</option>
              <option value="SEVEN_A_SIDE">7v7</option>
              <option value="ELEVEN_A_SIDE">11v11</option>
            </select>
          </div>
          {index > 0 && (
            <button type="button" onClick={() => removeYard(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mb-0.5">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => appendYard({ name: '', code: '', type: 'FIVE_A_SIDE' })} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" /> Add Another Yard
      </Button>
    </div>
  );
}
