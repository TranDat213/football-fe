import FootballFieldEditForm from '@/features/pitch/components/FootballFieldEditForm';

interface EditPitchPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPitchPage({ params }: EditPitchPageProps) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chỉnh sửa thông tin sân</h1>
      <FootballFieldEditForm fieldId={id} />
    </div>
  );
}