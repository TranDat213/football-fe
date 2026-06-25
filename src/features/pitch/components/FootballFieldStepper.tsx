'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { PitchFormSchema, PitchFormData } from '../schema/pitch.schema';
import { useSubmitPitch } from '../hooks/useSubmitPitch';

import FieldInformationStep from './steps/FieldInformationStep';
import FieldYardsStep from './steps/FieldYardsStep';
import FieldImagesStep from './steps/FieldImagesStep';
import PriceRulesStep from './steps/PriceRulesStep';
import OperatingHoursStep from './steps/OperatingHoursStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/route.constants';

const STEPS = [
  'Field Info',
  'Yards',
  'Images',
  'Price Rules',
  'Operating Hours',
  'Review & Submit',
];

const STEP_FIELDS: (keyof PitchFormData)[][] = [
  [
    'category_id',
    'name',
    'description',
    'address',
    'province',
    'district',
    'ward',
    'open_time',
    'close_time',
  ],
  ['yards'],
  ['images'],
  ['priceRules'],
  ['operatingHours'],
  [],
];

export default function FootballFieldStepper() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitPitch } = useSubmitPitch();

  const methods = useForm<PitchFormData>({
    resolver: zodResolver(PitchFormSchema),
    mode: 'onTouched',
    defaultValues: {
      category_id: '',
      name: '',
      description: '',
      address: '',
      province: '',
      district: '',
      ward: '',
      open_time: '06:00',
      close_time: '22:00',
      yards: [{ name: '', type: 'FIVE_A_SIDE', status: 'ACTIVE' }],
      images: [],
      priceRules: [],
      operatingHours: [],
    },
  });

  const { handleSubmit, trigger } = methods;

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await trigger(fields.length ? fields : undefined);
    if (isValid) setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: PitchFormData) => {
    setIsSubmitting(true);
    try {
      await submitPitch(data);
      toast.success('Field submitted! Awaiting admin approval.');
      router.push(ROUTES.ownerPitchSuccess);
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-8">
        {/* Stepper header */}
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center gap-1.5 min-w-max">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep > index
                    ? 'bg-emerald-600 text-white'
                    : currentStep === index
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-600/20'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {currentStep > index ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${currentStep >= index ? 'text-gray-900' : 'text-gray-400'}`}
              >
                {step}
              </span>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-6 h-px mx-1 ${currentStep > index ? 'bg-emerald-500' : 'bg-gray-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-8"> */}
        <form
          onSubmit={handleSubmit(
            onSubmit,
            (errors) => {
              console.log("❌ VALIDATION ERRORS:", errors);
            }
          )}
          className="space-y-8"
        >
          {currentStep === 0 && <FieldInformationStep />}
          {currentStep === 1 && <FieldYardsStep />}
          {currentStep === 2 && <FieldImagesStep />}
          {currentStep === 3 && <PriceRulesStep />}
          {currentStep === 4 && <OperatingHoursStep />}
          {currentStep === 5 && <ReviewSubmitStep />}

          {/* Navigation */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={handlePrev}
              disabled={currentStep === 0 || isSubmitting}
              className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 h-12 text-sm font-bold"
              >
                Tiếp theo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl px-8 h-12 text-sm font-bold disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />{' '}
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Gửi sân
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
