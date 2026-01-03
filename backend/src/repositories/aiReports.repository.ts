import { client } from "../database";

export interface AIReportRow {
  id: number;
  user_id: number;
  entry_id: number | null;
  report_type: "daily" | "weekly";
  report_date: string;
  report_end_date: string | null;
  content: any;
  created_at: string;
}

export class AIReportsRepository {
  static async findAllByUserId(userId: number): Promise<AIReportRow[]> {
    const result = await client.query(
      `
      SELECT
        id,
        user_id,
        entry_id,
        report_type,
        report_date::text as report_date,
        report_end_date::text as report_end_date,
        content,
        created_at
      FROM ai_reports
      WHERE user_id = $1
      `,
      [userId]
    );

    return result.rows;
  }

  static async deleteReport(
    reportId: number,
    userId: number
  ): Promise<boolean> {
    const result = await client.query(
      `
    DELETE FROM ai_reports
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
      [reportId, userId]
    );

    return (result.rowCount ?? 0) > 0;
  }

  static async findDailyReportByDate(
    userId: number,
    reportDate: string
  ): Promise<AIReportRow | null> {
    const result = await client.query(
      `
      SELECT
        id,
        user_id,
        entry_id,
        report_type,
        report_date::text as report_date,
        report_end_date::text as report_end_date,
        content,
        created_at
      FROM ai_reports
      WHERE user_id = $1 
        AND report_type = 'daily'
        AND report_date = $2
      LIMIT 1
      `,
      [userId, reportDate]
    );

    return result.rows[0] || null;
  }

  static async findWeeklyReportByDateRange(
    userId: number,
    reportStartDate: string,
    reportEndDate: string
  ): Promise<AIReportRow | null> {
    const result = await client.query(
      `
      SELECT
        id,
        user_id,
        entry_id,
        report_type,
        report_date::text as report_date,
        report_end_date::text as report_end_date,
        content,
        created_at
      FROM ai_reports
      WHERE user_id = $1 
        AND report_type = 'weekly'
        AND report_date = $2
        AND report_end_date = $3
      LIMIT 1
      `,
      [userId, reportStartDate, reportEndDate]
    );

    return result.rows[0] || null;
  }
}
