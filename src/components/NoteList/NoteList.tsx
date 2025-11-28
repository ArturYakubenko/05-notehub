import css from './NoteList.module.css';
import type { FC } from 'react';


export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';


export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
}


interface NoteListProps {
  data: Note[];
  removeNote: (id: string) => void;
}

const NoteList: FC<NoteListProps> = ({ data, removeNote }) => {
  return (
    <ul className={css.list}>
      {data.map((item) => (
        <li key={item.id} className={css.listItem}>
          <h2 className={css.title}>{item.title}</h2>
          <p className={css.content}>{item.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{item.tag}</span>
            <button className={css.button} onClick={() => removeNote(item.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;