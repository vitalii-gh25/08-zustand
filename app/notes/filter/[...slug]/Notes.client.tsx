// app/notes/filter/[...slug]/Notes.client.tsx

'use client';

import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { fetchNotes } from '@/lib/api';
import type { Note } from '@/types/note';
import type { FetchNotesResponse } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

interface NotesClientProps {
  defaultTag?: string;
}

export default function NotesClient({ defaultTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const tag = defaultTag;

  const queryClient = useQueryClient();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 900);

  const { data, isFetching, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', currentPage, searchQuery, tag],
    queryFn: () =>
      fetchNotes({ page: currentPage, perPage: 12, search: searchQuery, tag }),
    placeholderData: () =>
      queryClient.getQueryData<FetchNotesResponse>([
        'notes',
        currentPage - 1,
        searchQuery,
        tag,
      ]),
  });

  if (isFetching && !data)
    return <p className={css.message}>Loading notes...</p>;
  if (isError) return <p className={css.message}>Error loading notes.</p>;

  const notes: Note[] = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox defaultValue={searchQuery} onChange={debouncedSearch} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            setPage={setCurrentPage}
            currentPage={currentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create Note +
        </Link>
      </header>

      <main className={css.main}>
        {notes.length > 0 ? (
          <NoteList notes={notes} />
        ) : (
          <p className={css.message}>No notes found.</p>
        )}
      </main>
    </div>
  );
}
