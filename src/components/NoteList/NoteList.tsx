import css from './NoteList.module.css';
import type { FC } from 'react';
import type { Note } from '../../types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService.ts';

interface NoteListProps {
  data: Note[];
}

const NoteList: FC<NoteListProps> = ({ data }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul className={css.list}>
      {data.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content || 'No content'}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <button
              className={css.button}
              disabled={mutation.isPending}
              onClick={() => mutation.mutate(item.id)}
            >
              {mutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;