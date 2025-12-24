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
}

const token = import.meta.env.VITE_NOTEHUB_TOKEN;
const API_URL = "https://notehub-public.goit.study/api/notes";

// Оновлена функція для отримання нотаток
export const fetchNotes = async (page: number, search: string, perPage: number) => {
  try {
    const response = await axios.get<FetchNotesResponse>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page: page,
        search: search,
        perPage: perPage,
      },
    });
    
    return {
      notes: response.data.notes ?? [],
      totalPages: response.data.totalPages ?? 0,
    };
  } catch (error) {
    // Повертаємо об'єкт, що відповідає інтерфейсу FetchNotesResponse
    console.error("Error fetching notes:", error);
    return {
      notes: [],          // Повертаємо порожній список нотаток
      totalPages: 0,      // Повертаємо 0 сторінок
    };
  }
};

// Функція для видалення нотатки
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

// Функція для створення нотатки
export const createNote = async (noteData: CreateNoteParams): Promise<Note> => {
  try {
    const response = await axios.post<Note>(API_URL, noteData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при создании заметки:", error);
    throw error;
  }
};