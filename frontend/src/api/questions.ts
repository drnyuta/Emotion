import { Question } from "../globalInterfaces";
import axiosInstance from "./axios";

export const getQuestions = async (): Promise<Question[]> => {
  const response = await axiosInstance.get("/questions");
  return response.data.questions;
};

export const getQuestionById = async (id: number): Promise<Question> => {
  const response = await axiosInstance.get(`/questions/${id}`);
  return response.data.question;
};