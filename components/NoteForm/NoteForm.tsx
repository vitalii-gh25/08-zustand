// components/NoteForm/NoteForm.tsx

'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNoteStore } from '@/lib/noteStore';
import css from './NoteForm.module.css';

export default function NoteForm() {
  const router = useRouter();
  const { draft, setDraft, clearDraft } = useNoteStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Отмена: возвращаемся на предыдущую страницу, draft сохраняем
  const handleCancel = () => {
    router.back();
  };

  // Изменение полей формы сохраняем в draft
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  // Сабмит формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await axios.post('https://notehub-public.goit.study/api/notes', draft, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
        },
      });

      clearDraft(); // очищаем draft после успешного создания
      router.back(); // возвращаемся на предыдущий маршрут с прогрессом
    } catch (err) {
      console.error(err);
      setError('Error creating note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={6}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="">-- Select tag --</option> {/* пустая опция */}
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Create note'}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
