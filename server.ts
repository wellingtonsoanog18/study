import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Render automatically assigns a dynamic port via process.env.PORT
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Server-side proxy route for AI Generation
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Parâmetro prompt é obrigatório.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: 'Chave GEMINI_API_KEY não configurada no servidor. O prompt já foi copiado para sua área de transferência para colar no Gemini.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Você é um professor e coordenador de mentoria para concursos públicos e vestibulares de alta performance. Entregue respostas com formatação clara em Markdown, mnemônicos chamativos, resumos conceituais e gabaritos fundamentados.'
      }
    });

    res.json({ text: response.text });
  } catch (error: unknown) {
    console.error('Error generating with Gemini API:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Erro ao processar requisição com Gemini API.'
    });
  }
});

// Health check endpoint for deployment platforms
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount Vite middleware in development or serve static built files in production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(process.cwd(), 'dist');
  const indexPath = path.resolve(distPath, 'index.html');

  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Not Found: arquivos do build não encontrados em dist/. Certifique-se de que o Build Command é "npm run build".');
    }
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyFlow Pro Server listening on port ${PORT}`);
});
