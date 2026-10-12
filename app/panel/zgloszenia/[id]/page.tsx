import { RepairDetail } from '@/components/repair-detail';
export default async function RepairPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RepairDetail id={id} />;
}
