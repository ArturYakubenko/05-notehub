import axios from "axios";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

export const api = axios.create({
  baseURL: "https://notehub.pro/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface Note {
  id: number;
  title: string;
  text: string;
}