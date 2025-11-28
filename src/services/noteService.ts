import axios from "axios";
import type { Note, NoteTag } from "../types/note";


export interface CreateNoteParams {
  title: string;
  content?: string;
  tag: NoteTag;
}


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const API_URL = "https://notehub-public.goit.study/api/notes";


type LoaderFn = (loading: boolean) => void;
type ErrorFn = (error: boolean) => void;


export const fetchNotes = async (
  page: number = 1,
  search: string = "",
  perPage: number,
  swichIsLoader: LoaderFn,
  swichIsError: ErrorFn
): Promise<FetchNotesResponse | undefined> => {
  try {
    swichIsLoader(true);

    const response = await axios.get<FetchNotesResponse>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, search, perPage },
    });

    return response.data;
  } catch {
    swichIsError(true);
  } finally {
    swichIsLoader(false);
  }
};


export const deleteNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.delete<Note>(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении заметки:", error);
    throw error;
  }
};


export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  try {
    const response = await axios.post<Note>(
      API_URL,
      noteData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка при создании заметки:", error);
    throw error;
  }
};