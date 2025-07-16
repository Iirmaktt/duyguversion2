// login endpoint
import { knex } from '@/db/knex';
import type { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 👇 Bu satır çok önemli: Kullanıcıyı veritabanından bul!
    const user = await knex('users').where({ email }).first();

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // Şifreyi kontrol et (hash yoksa direkt karşılaştır)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
    }

    res.json({ message: 'Giriş başarılı!', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
}
