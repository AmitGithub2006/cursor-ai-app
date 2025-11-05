import ConceptPage from '@/components/ConceptPage';

export default async function RegionPage({
  params,
}: {
  params: Promise<{ regionId: string }>;
}) {
  const { regionId } = await params;
  return <ConceptPage regionId={regionId} />;
}

