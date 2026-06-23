'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { PitchFormSchema, PitchFormData } from '../schema/pitch.schema';
import FieldInformationStep from './steps/FieldInformationStep';
import FieldYardsStep from './steps/FieldYardsStep';
import FieldImagesStep from './steps/FieldImagesStep';
import PriceRulesStep from './steps/PriceRulesStep';
import OperatingHoursStep from './steps/OperatingHoursStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';

const STEPS = [
  'Field Information',
  'Field Yards',
  'Images',
  'Price Rules',
  'Operating Hours',
  'Review & Submit'
];

export default function FootballFieldStepper() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const methods = useForm<PitchFormData>({
    resolver: zodResolver(PitchFormSchema),
    defaultValues: {
      name: '', categoryId: '', description: '', address: '', province: '', district: '', ward: '',
      yards: [{ name: '', code: '', type: 'FIVE_A_SIDE' }],
      images: [],
      priceRules: [],
      operatingHours: []
    }
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    let fieldsToValidate: any = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'address', 'province', 'district'];
    else if (currentStep === 1) fieldsToValidate = ['yards'];
    else if (currentStep === 2) fieldsToValidate = ['images'];
    else if (currentStep === 3) fieldsToValidate = ['priceRules'];
    else if (currentStep === 4) fieldsToValidate = ['operatingHours'];

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(curr => curr + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(curr => curr - 1);
  };

  const onSubmit = async (data: PitchFormData) => {
    try {
      // Simulate API submit
      console.log('Submitting Football Field Payload:', data);
      toast.success('Football Field creation request submitted successfully!');
    } catch (err) {
      toast.error('Failed to submit football field request.');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center gap-2 min-w-max">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= index ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {currentStep > index ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${currentStep >= index ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
              {index < STEPS.length - 1 && <div className={`w-8 h-0.5 mx-2 ${currentStep > index ? 'bg-emerald-600' : 'bg-gray-100'}`} />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {currentStep === 0 && <FieldInformationStep />}
          {currentStep === 1 && <FieldYardsStep />}
          {currentStep === 2 && <FieldImagesStep />}
          {currentStep === 3 && <PriceRulesStep />}
          {currentStep === 4 && <OperatingHoursStep />}
          {currentStep === 5 && <ReviewSubmitStep />}

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {currentStep < STEPS.length - 1 ? (
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-lg shadow-emerald-700/10 active:scale-95 transition-all"
              >
                Next Step <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-8 h-12 text-sm font-bold shadow-lg shadow-emerald-900/10 active:scale-95 transition-all"
              >
                Submit Field Request <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
