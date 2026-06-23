import { useFormContext } from 'react-hook-form';
import { PitchFormData } from '../../schema/pitch.schema';

export default function ReviewSubmitStep() {
  const { watch } = useFormContext<PitchFormData>();
  const formValues = watch();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6">
        <h3 className="font-bold text-lg text-emerald-900 mb-4">Review Your Field Submission</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><span className="font-bold text-gray-900">Name:</span> {formValues.name}</li>
          <li><span className="font-bold text-gray-900">Address:</span> {formValues.address}, {formValues.district}, {formValues.province}</li>
          <li><span className="font-bold text-gray-900">Yards Added:</span> {formValues.yards.length}</li>
          <li><span className="font-bold text-gray-900">Price Rules Configured:</span> {formValues.priceRules?.length || 0}</li>
          <li><span className="font-bold text-gray-900">Op. Hours Configured:</span> {formValues.operatingHours?.length || 0}</li>
        </ul>
        <p className="mt-6 text-xs text-emerald-700 font-medium">Click Submit to finalize the request. It will be marked as PENDING for admin approval.</p>
      </div>
    </div>
  );
}
