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
//

export const fetchNotes = async (page: number, search: string, perPage: number) => {
  try {

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: ` bearer ${token}`,
      },
      params: {
        page: page,
        search: search,
        perPage: perPage
      }
    })
    return {
      notes: response.data.notes ?? [],
      totalPages: response.data.totalPages ?? 0,
      totalNotes: response.data.totalNotes ?? 0,
    };
  }
  catch {
    console.log("error")
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