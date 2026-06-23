import { useFormContext } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';

export default function FieldInformationStep() {
  const { register, formState: { errors } } = useFormContext<PitchFormData>();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Pitch Name</label>
          <input {...register('name')} className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Address</label>
          <input {...register('address')} className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
          {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Province</label>
          <input {...register('province')} className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
          {errors.province && <p className="text-red-500 text-xs">{errors.province.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-500">District</label>
          <input {...register('district')} className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none" />
          {errors.district && <p className="text-red-500 text-xs">{errors.district.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Description</label>
        <textarea rows={4} {...register('description')} className="w-full rounded-xl border border-gray-100 px-4 py-3 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/5 transition-all outline-none resize-none" />
      </div>
    </div>
  );
}
