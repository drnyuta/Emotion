import { client } from "../database";

export const getDatesWithEntries = async (
  userId: number,
  year: number,
  month: number
) => {
  const res = await client.query(
    `SELECT entry_date FROM diary_entries
     WHERE user_id = $1
       AND EXTRACT(YEAR FROM entry_date) = $2
       AND EXTRACT(MONTH FROM entry_date) = $3`,
    [userId, year, month]
  );
  return res.rows;
};

export const getEntryByDate = async (userId: number, entryDate: string) => {
  const entryRes = await client.query(
    `SELECT * FROM diary_entries WHERE user_id = $1 AND entry_date = $2`,
    [userId, entryDate]
  );

  if (entryRes.rows.length === 0) return null;

  const entry = entryRes.rows[0];

  const emotionsRes = await client.query(
    `SELECT e.name as emotion_name, ec.id as category_id, ec.name as category_name
     FROM emotions e
     JOIN entry_emotions ee ON ee.emotion_id = e.id
     JOIN emotion_categories ec ON ec.id = e.category_id
     WHERE ee.entry_id = $1`,
    [entry.id]
  );

  const emotions = emotionsRes.rows.map((row: any) => ({
    emotion: row.emotion_name,
    category: {
      id: row.category_id,
      name: row.category_name,
    },
  }));

  return {
    id: entry.id,
    user_id: entry.user_id,
    entry_date: entry.entry_date.toLocaleDateString("en-CA"),
    content: entry.content,
    question_id: entry.question_id,
    created_at: entry.created_at.toISOString(),
    updated_at: entry.updated_at.toISOString(),
    emotions,
  };
};

export const createEntry = async (
  userId: number,
  entryDate: string,
  content: string,
  questionId?: number,
  emotions?: number[] 
) => {
  const res = await client.query(
    `INSERT INTO diary_entries (user_id, entry_date, content, question_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, NOW(), NOW())
     RETURNING *`,
    [userId, entryDate, content, questionId || null]
  );

  const entry = res.rows[0];

  if (emotions && emotions.length > 0) {
    const insertValues = emotions
      .map((_, idx) => `($1, $${idx + 2})`)
      .join(", ");

    await client.query(
      `INSERT INTO entry_emotions (entry_id, emotion_id) VALUES ${insertValues}`,
      [entry.id, ...emotions]
    );
  }

  return entry;
};

export const updateEntry = async (
  entryId: number,
  userId: number,
  content?: string,
  questionId?: number | null,
  emotions?: number[]
) => {
  try {
    await client.query("BEGIN");

    if (content !== undefined || questionId !== undefined) {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;

      if (content !== undefined) {
        updates.push(`content = $${paramCounter}`);
        values.push(content);
        paramCounter++;
      }

      if (questionId !== undefined) {
        updates.push(`question_id = $${paramCounter}`);
        values.push(questionId);
        paramCounter++;
      }

      updates.push(`updated_at = NOW()`);

      values.push(entryId, userId);

      const query = `
        UPDATE diary_entries
        SET ${updates.join(", ")}
        WHERE id = $${paramCounter} AND user_id = $${paramCounter + 1}
        RETURNING *
      `;

      const res = await client.query(query, values);

      if (res.rows.length === 0) {
        throw new Error("Entry not found or does not belong to the user.");
      }
    }

    if (emotions && emotions.length >= 0) {
      const res = await client.query(
        `SELECT emotion_id FROM entry_emotions WHERE entry_id = $1`,
        [entryId]
      );
      const oldEmotionIds = res.rows.map((r: any) => r.emotion_id);

      const toAdd = emotions.filter((id) => !oldEmotionIds.includes(id));
      const toRemove = oldEmotionIds.filter((id) => !emotions.includes(id));

      if (toRemove.length > 0) {
        await client.query(
          `DELETE FROM entry_emotions WHERE entry_id = $1 AND emotion_id = ANY($2)`,
          [entryId, toRemove]
        );
      }

      if (toAdd.length > 0) {
        const insertQuery = `
          INSERT INTO entry_emotions (entry_id, emotion_id) 
          VALUES ${toAdd.map((_, i) => `($1, $${i + 2})`).join(", ")}
          ON CONFLICT DO NOTHING
        `;
        await client.query(insertQuery, [entryId, ...toAdd]);
      }
    }

    await client.query("COMMIT");

    const updatedRow = await client.query(
      `SELECT entry_date FROM diary_entries WHERE id = $1 AND user_id = $2`,
      [entryId, userId]
    );

    if (updatedRow.rows.length === 0) return null;

    const entryDate = updatedRow.rows[0].entry_date.toLocaleDateString("en-CA")
    const updatedEntry = await getEntryByDate(userId, entryDate);
    return updatedEntry;
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error in updateEntry:", err);
    throw err;
  }
};

export const deleteEntry = async (entryId: number) => {
  await client.query("DELETE FROM entry_emotions WHERE entry_id = $1", [
    entryId,
  ]);
  await client.query(`DELETE FROM diary_entries WHERE id = $1`, [entryId]);
};

