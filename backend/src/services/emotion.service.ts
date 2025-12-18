import { client } from "../database";

export const getCategoriesWithEmotions = async () => {
  const categoriesRes = await client.query(
    `SELECT id, name FROM emotion_categories ORDER BY name`
  );

  const result = [];

  for (const category of categoriesRes.rows) {
    const emotionsRes = await client.query(
      `SELECT id, name FROM emotions WHERE category_id = $1 ORDER BY name`,
      [category.id]
    );

    result.push({
      id: category.id,
      name: category.name,
      emotions: emotionsRes.rows,
    });
  }

  return result;
};
