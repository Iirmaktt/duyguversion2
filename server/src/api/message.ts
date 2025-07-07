import { knex } from "@/db/knex";
export const message = async (req: any, res: any) => {
  try {
    const messages = await knex.select().from('messages');

    res.status(200).json(messages);
  } catch (err) {
    console.error("GET /messages HATASI:", err);
    res.status(500).json({ error: "Mesajlar alınamadı." });
  }
}