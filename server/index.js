import express from 'express';
import cors from 'cors';
import { getContent } from './getContent.js';

const app = express();
app.use(cors());

app.get('/api/content', (req, res) => {
  try {
    res.json(getContent());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load content' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
