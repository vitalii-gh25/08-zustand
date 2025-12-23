// app/notes/filter/[...slug]/page.tsx

import { Metadata } from 'next';
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from '@tanstack/react-query';

import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

type Props = {
  params: Promise<{ slug?: string[] }>;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug?.[0] ?? 'all';
  const title =
    filter === 'all' ? 'All notes' : `Notes filtered by "${filter}"`;

  const description =
    filter === 'all'
      ? 'Browse all available notes'
      : `Browse notes filtered by tag "${filter}"`;

  const url = `https://notehub.com/notes/filter/${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}


const NotesByCategory = async ({ params }: Props) => {
  const { slug: slugArr } = await params;
  const slug = slugArr || ['all'];
  const tag = slug[0] === 'all' ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: '',
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient defaultTag={tag} />
    </HydrationBoundary>
  );
};

export default NotesByCategory;
