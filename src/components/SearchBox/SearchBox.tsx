import css from './SearchBox.module.css';
import type { FC, ChangeEvent } from 'react';


interface SearchBoxProps {
  onSearch: (value: string) => void;
}

const SearchBox: FC<SearchBoxProps> = ({ onSearch }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
    />
  );
};

export default SearchBox;