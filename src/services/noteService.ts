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

// Fetch notes
export async function fetchNotes(
  page: number,
  search: string,
  limit: number
): Promise<FetchNotesResponse> {
  try {
    const res = await fetch(`${API_URL}?page=${page}&search=${search}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch notes");

    const data = await res.json();

    return {
      notes: data.notes ?? [],
      totalPages: data.totalPages ?? 0,
      totalNotes: data.totalNotes ?? 0,
    };
  } catch (error) {
    console.error("Ошибка при получении заметок:", error);
    // Всегда возвращаем объект FetchNotesResponse, никогда undefined
    return {
      notes: [],
      totalPages: 0,
      totalNotes: 0,
    };
  }
}

// Delete note
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

// Create note
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