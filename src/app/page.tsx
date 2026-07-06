import WattpadSearchResults from '@/components/WattpadSearchResults';
import HomeClient from '@/components/HomeClient';

interface PageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { search: searchQuery = '' } = await searchParams;

  if (searchQuery) {
    return (
      <main className="min-h-screen bg-[#0f0f12] text-white">
        <WattpadSearchResults query={searchQuery} />
      </main>
    );
  }

  return <HomeClient />;
}
