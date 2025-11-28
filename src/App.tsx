import css from "./App.module.css";
import Modal from "./components/Modal/Modal";
import NoteForm from "./components/NoteForm/NoteForm";
import NoteList from "./components/NoteList/NoteList";
import Pagination from "./components/Pagination/Pagination";
import SearchBox from "./components/SearchBox/SearchBox";
import { fetchNotes, createNote, deleteNote } from "./services/noteService";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import EmptyState from "./components/EmptyState/EmptyState";
import type { NoteTag, Note } from "./types/note";

// Параметры для создания заметки
interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

// Ответ fetchNotes
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalCount: number;
}

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const onSearch = (value: string) => setSearch(value);
  const swichIsLoader = (v: boolean) => setIsLoading(v);
  const swichIsError = (v: boolean) => setIsError(v);
  const openModal = () => setModalIsOpen((prev) => !prev);

  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  // Fetch notes
  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () =>
      fetchNotes(page, debouncedSearch, 12, swichIsLoader, swichIsError),
  });

  const pageCount = data?.totalPages ?? 0;

  // Delete note
  const { mutate: removeNote } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

  // Create note
  const { mutate: addNote } = useMutation({
    mutationFn: (noteData: CreateNoteParams) => createNote(noteData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"] }),
  });

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
          create
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={"error"} />}
      {data && data.notes.length === 0 && <EmptyState />}
      {(data?.notes ?? []).length > 0 && (
        <NoteList data={data?.notes ?? []} removeNote={removeNote} />
      )}

      {modalIsOpen && (
        <Modal openModal={openModal}>
          <NoteForm addNote={addNote} openModal={openModal} />
        </Modal>
      )}
    </div>
  );
}