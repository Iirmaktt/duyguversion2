import express from 'express';
import { errorMiddleware } from '@/middlewares/errorMiddleware';
import { loggerMiddleware } from '@/middlewares/logger';
import { connectMongoose } from '@/lib/mongoose';
import { analyze } from './api/analyze';
import { message } from './api/message';
import cors from 'cors';
  const app = express();
  const port = (5000);

  // parse jsons
  app.use(express.json());
  // parse forms
  app.use(express.urlencoded({ extended: true }));

  app.use(loggerMiddleware);
  app.use(appRouter);
  app.use(errorMiddleware);
  app.use(cors());


  // ✅ Analyze Endpoint → Duygu analizi yapar ve veritabanına kaydeder

  app.post('/analyze', analyze);

  // ✅ History Endpoint → Tüm mesajları getirir
  app.get('/messages', message);


  app.listen(port, '0.0.0.0', () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });