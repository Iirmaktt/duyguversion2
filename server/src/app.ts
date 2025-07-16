import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares/errorMiddleware';
import { loggerMiddleware } from '@/middlewares/logger';
import { connectMongoose } from '@/lib/mongoose'; // Bunu kullanıyorsan MongoDB için
import { analyze } from './api/analyze';
import { message } from './api/message';
import { register } from './api/signup'; 
import { login } from './api/login'; // Login endpoint'i ekle
const app = express();
const port = 5000;

// parse JSON
app.use(express.json());

// parse forms (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// CORS izinleri
app.use(cors());

// Logger
app.use(loggerMiddleware);

// Error handler
app.use(errorMiddleware);

// ✅ Analyze Endpoint → Duygu analizi yapar ve veritabanına kaydeder
app.post('/analyze', analyze);

// ✅ History Endpoint → Tüm mesajları getirir
app.get('/messages', message);

// ✅ Register Endpoint → Kullanıcı kayıt işlemi
app.post('/register', register);

// ✅ Login Endpoint → Kullanıcı giriş işlemi
app.post('/login', login)

app.listen(port, '0.0.0.0', () => {
  console.log(`Express is listening at http://localhost:${port}`);
});
