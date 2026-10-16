import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

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

// Mount Vite middleware in development or static in production
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static('dist'));
  app.get('*', (_req, res) => {
    res.sendFile('dist/index.html', { root: '.' });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`StudyFlow Pro Server running on http://0.0.0.0:${PORT}`);
});
