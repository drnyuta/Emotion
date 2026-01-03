import { client } from "../database";

export interface Insight {
  id: number;
  userId: number;
  insightText: string;
  insightDate: string;
  createdAt: string;
  updatedAt: string;
}

export class InsightsService {
  static async createInsight(
    userId: number,
    insightText: string,
    insightDate: string
  ) {
    const result = await client.query(
      `INSERT INTO insights (user_id, insight_text, insight_date)
       VALUES ($1, $2, $3)
       RETURNING id, user_id AS "userId", insight_text AS "insightText", insight_date::text AS "insightDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [userId, insightText, insightDate]
    );
    return result.rows[0];
  }

  static async getAllInsights(userId: number) {
    const result = await client.query(
      `SELECT id, user_id AS "userId", insight_text AS "insightText", insight_date::text AS "insightDate", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM insights WHERE user_id = $1
       ORDER BY insight_date DESC`,
      [userId]
    );
    return result.rows;
  }

  static async updateInsight(
    insightId: number,
    userId: number,
    insightText: string
  ) {
    const result = await client.query(
      `UPDATE insights
       SET insight_text = $1, updated_at = NOW()
       WHERE id = $2 AND user_id = $3
       RETURNING id, user_id AS "userId", insight_text AS "insightText", insight_date::text AS "insightDate", created_at AS "createdAt", updated_at AS "updatedAt"`,
      [insightText, insightId, userId]
    );
    return result.rows[0];
  }

  static async deleteInsight(insightId: number, userId: number) {
    await client.query(`DELETE FROM insights WHERE id = $1 AND user_id = $2`, [
      insightId,
      userId,
    ]);
  }

  static async getInsightById(insightId: number) {
    const result = await client.query(
      `SELECT id, user_id AS "userId", insight_text AS "insightText", insight_date::text AS "insightDate", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM insights WHERE id = $1`,
      [insightId]
    );
    return result.rows[0];
  }
}
