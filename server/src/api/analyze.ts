
// ✅ ENV VARS
import pool from '@/db/mysql';
import axios from 'axios';

const HF_TOKEN = 'AIzaSyDP22fXxp-fG9pGiMEIenBIKo4PaFKLx_M';
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const analyze = async (req:any, res:any) => {
    const { message, user_id } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Mesaj eksik." });
    }
  
    let conn;
  
    try {
      // 1. Gemini API'ye gönder
      const response = await axios.post(
        MODEL_URL,
        {
          systemInstruction: {
            parts: [
              { text: "sen bir duygu analizi modelisin sana gelen cümleyi analiz et ve duygumu söyle" }
            ]
          },
          contents: [
            {
              parts: [
                { text: message }
              ]
            }
          ]
        },
        {
          headers: { 'X-goog-api-key': HF_TOKEN }
        }
      );
  
      const sentiment = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'analiz başarısız';
      const fullResponse = JSON.stringify(response.data); // 🔧 Değiştirildi
  
      // 2. Veritabanına kaydet
      conn = await pool.getConnection();
  
      const msgResult = await conn.query(
        "INSERT INTO messages (user_id, message, sentiment) VALUES (?, ?, ?)",
        [user_id || null, message, sentiment]
      );
  
      const message_id = Number(msgResult.insertId); // 🔧 BigInt olabilir, sayıya çevirdik
  
      await conn.query(
        "INSERT INTO responses (message_id, response) VALUES (?, ?)",
        [message_id, fullResponse]
      );
  
      res.status(201).json({
        sentiment,
        message_id,
        success: true
      });
  
    } catch (error:any) {
      console.error("📛 HATA DETAYI:", JSON.stringify(error)); // 🔧 Değiştirildi
      res.status(500).json({
        error: 'Gemini API veya veritabanı hatası.',
        detay: error?.message || error?.sqlMessage || JSON.stringify(error) // 🔧 Değiştirildi
      });
    } finally {
      if (conn) conn.release();
    }
}
  