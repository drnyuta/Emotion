import { Question } from "../globalInterfaces";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getQuestions = async (): Promise<Question[]> => {
  const response = await axios.get(`${API_URL}/questions`);
  return response.data.questions;
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const response = await axios.get(`${API_URL}/questions/${id}`);
  return response.data.question;
};