import css from "./App.module.css";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyState from "../EmptyState/EmptyState";

import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";


import { useState } from "react";
import { useQuery,  } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";


export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  // При новом поисковом запросе сбрасываем страницу на 1
  const onSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // Fetch notes с указанием generic типа
  const { data, isError, isLoading } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch, 12),
  });

  const notes = data?.notes ?? [];
  const pageCount = data?.totalPages ?? 0;

 

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={onSearch} />

        {pageCount > 1 && (
          <Pagination
            pageCount={pageCount}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={openModal}>
          Create
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message="Ошибка при загрузке заметок" />}
      {!isLoading && notes.length === 0 && <EmptyState />}
      {notes.length > 0 && (
        <NoteList
          data={notes}
        />
      )}

      {modalIsOpen && (
        <Modal closeModal={closeModal}>
          <NoteForm
            closeModal={closeModal}
          />
        </Modal>
      )}
    </div>
  );
}
