import { useFormContext, useFieldArray } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export default function OperatingHoursStep() {
  const { register, control, watch } = useFormContext<PitchFormData>();
  const { fields: hourFields, append: appendHour, remove: removeHour } = useFieldArray({ control, name: 'operatingHours' });
  const formValues = watch();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {hourFields.map((field: any, index: number) => (
        <div key={field.id} className="p-4 border border-gray-100 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4 items-end bg-gray-50/50 relative">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Yard</label>
            <select {...register(`operatingHours.${index}.yardIndex`, { valueAsNumber: true })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white">
              {formValues.yards.map((y: any, yi: number) => (
                <option key={yi} value={yi}>{y.name || `Yard ${yi+1}`}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Day of Wk</label>
            <select {...register(`operatingHours.${index}.dayOfWeek`, { valueAsNumber: true })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white">
              {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((d, di) => (
                <option key={di} value={di}>{d}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Open</label>
            <input type="time" {...register(`operatingHours.${index}.openTime`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Close</label>
            <input type="time" {...register(`operatingHours.${index}.closeTime`)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <button type="button" onClick={() => removeHour(index)} className="absolute top-2 right-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={() => appendHour({ yardIndex: 0, dayOfWeek: 1, openTime: '06:00', closeTime: '22:00' })} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-2" /> Add Operating Hour
      </Button>
    </div>
  );
}
