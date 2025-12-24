import { client } from "../database";

export const getAllQuestions = async () => {
  const res = await client.query(
    `
    SELECT id, question_text
    FROM questions
    ORDER BY created_at DESC
    `
  );

  return res.rows;
};

export const getQuestionById = async (id: number) => {
  const res = await client.query(
    `
    SELECT id, question_text
    FROM questions
    WHERE id = $1
    `,
    [id]
  );

  if (!res.rows.length) {
    throw new Error("Question not found");
  }

  return res.rows[0];
};
