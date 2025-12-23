// app/notes/[id]/NoteDetails.client.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

import css from './NoteDetails.module.css';

interface Props {
  id: string;
}

const NoteDetailsClient = ({ id }: Props) => {
  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>

        {/* ✅ ТІЛЬКИ createdAt */}
        <p className={css.date}>Created at: {note.createdAt}</p>
      </div>
    </div>
  );
};

export default NoteDetailsClient;
