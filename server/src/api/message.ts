import pool from "@/db/mysql";
export const message = async (req: any, res: any) => {
        try {
          const conn = await pool.getConnection();
          const messages = await conn.query("SELECT * FROM messages ORDER BY id DESC");
          conn.release();
      
          res.status(200).json(messages);
        } catch (err) {
          console.error("GET /messages HATASI:", err);
          res.status(500).json({ error: "Mesajlar alınamadı." });
        } }