
// ✅ ENV VARS
/*
import pool from '@/db/mysql';
import axios from 'axios';
import { knex } from '@/db/knex';

const HF_TOKEN = 'AIzaSyDP22fXxp-fG9pGiMEIenBIKo4PaFKLx_M';
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const analyze = async (req:any, res:any) => {
    const { message, user_id } = req.body;
  
    if (!message) {
      return res.status(400).json({ error: "Mesaj eksik." });
    }
  
  
    try {
      // 1. Gemini API'ye gönder
      const response = await axios.post(
        MODEL_URL,
        {
          systemInstruction: {
            parts: [
              { text: "Sen bir duygu analizi uzmanısın. Sana verilen cümleyi dikkatlice analiz et. " +
                "Cümledeki duyguyu 'olumlu', 'olumsuz' veya 'nötr' olarak sınıflandır. " +
                "Sonuç formatı:\n\nDuygu: <duygu türü>\nAçıklama: <neden>"
               }
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
      // conn = await pool.getConnection();
  
      // const msgResult = await conn.query(
      //   "INSERT INTO messages (user_id, message, sentiment) VALUES (?, ?, ?)",
      //   [user_id || null, message, sentiment]
      // );
      const [message_id] =  await knex('messages').insert({ user_id, message, sentiment });

      // await conn.query(
      //   "INSERT INTO responses (message_id, response) VALUES (?, ?)",
      //   [message_id, fullResponse]
      // );
      const [response_id] = await knex('responses').insert({ message_id, response: fullResponse });
      console.log("3", message_id);

      res.status(201).json({
        sentiment,
        message_id,
        success: true
      });
  
    } 
    
    
    
    
    
    
    catch (error:any) {
      console.error("📛 HATA DETAYI:", JSON.stringify(error,null,4)); // 🔧 Değiştirildi
      res.status(500).json({
        error: 'Gemini API veya veritabanı hatası.',
        detay: error?.message || error?.sqlMessage || JSON.stringify(error) 
        
// 🔧 Değiştirildi
      });
    } 
}
  */

import pool from '@/db/mysql';
import axios from 'axios';
import { knex } from '@/db/knex';

const HF_TOKEN = 'AIzaSyDP22fXxp-fG9pGiMEIenBIKo4PaFKLx_M';
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export const analyze = async (req: any, res: any) => {
  const { message, user_id } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Mesaj eksik." });
  }

  try {
    // 1) Gemini API'ye gönder
    const response = await axios.post(
      MODEL_URL,
      {
        systemInstruction: {
          parts: [
            {
              text:
                "Sen bir duygu analizi uzmanısın. Sana verilen cümleyi dikkatlice analiz et. " +
                "Cümledeki duyguyu 'Olumlu', 'Olumsuz' veya 'Nötr' olarak sınıflandır. " +
                "Yanıt formatı **tek bir satır** olmalı, fazladan tekrar yok: \n" +
                "Duygu: <duygu türü>\nAçıklama: <neden>"
            }
          ]
        },
        contents: [
          { parts: [{ text: message }] }
        ]
      },
      {
        headers: { 'X-goog-api-key': HF_TOKEN }
      }
    );

    const sentiment = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'analiz başarısız';
    const fullResponse = JSON.stringify(response.data);

    console.log("🟢 Gemini Sentiment:", sentiment);

    // 2) Duygu ID'sini çıkar
    const feelingId = extractFeelingId(sentiment);
    console.log("🟢 Extracted Feeling ID:", feelingId);

    // 3) Mesajı kaydet
    const [message_id] = await knex('messages').insert({
      user_id,
      message,
      sentiment
    });

    console.log("🟢 INSERT messages sonucu:", message_id);

    // 4) Response'u kaydet (duygu ID FK ekli!)
    const [response_id] = await knex('responses').insert({
      message_id,
      response: fullResponse,
      feeling_id: feelingId // 🎯 FK bağlanıyor!
    });

    console.log("🟢 INSERT response sonucu:", response_id);

    res.status(201).json({
      sentiment,
      message_id,
      feeling_id: feelingId,
      success: true
    });

  } catch (error: any) {
    console.error("📛 HATA DETAYI (ham):", error);
    console.error("📛 HATA DETAYI (JSON):", JSON.stringify(error, null, 4));

    if (error.sqlMessage) {
      console.error("📛 SQL MESSAGE:", error.sqlMessage);
    }

    if (error.response) {
      console.error("📛 AXIOS RESPONSE DATA:", error.response.data);
      console.error("📛 AXIOS RESPONSE STATUS:", error.response.status);
      console.error("📛 AXIOS RESPONSE HEADERS:", error.response.headers);
    }

    res.status(500).json({
      error: 'Gemini API veya veritabanı hatası.',
      detay: error?.message || error?.sqlMessage || JSON.stringify(error)
    });
  }
};

// ✅ Duygu ID eşleştirici fonksiyon (regex toleranslı!)
function extractFeelingId(text: string): number | null {
  // Fazladan "Duygu: Duygu:" gibi tekrar olursa yakala
  const match = text.match(/Duygu:\s*(?:Duygu:\s*)?(Olumlu|Olumsuz|Nötr)/i);
  const label = match ? match[1].toLowerCase() : null;

  switch (label) {
    case 'olumlu':
      return 1;
    case 'olumsuz':
      return 2;
    case 'nötr':
      return 3;
    default:
      console.warn("⚠️ Duygu tanımlanamadı, fallback: NULL");
      return null;
  }
}
