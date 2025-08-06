import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

app.post('/extract-texts', async (req, res) => {
  const urls = req.body.urls;
  if (!Array.isArray(urls)) {
    return res.status(400).json({ error: 'Expected \"urls\" to be an array of objects.' });
  }

  const results = await Promise.all(urls.map(async (entry) => {
    const txtUrl = entry[".txt"];
    try {
      const r = await fetch(txtUrl);
      const text = await r.text();
      return {
        ...entry,
        success: true,
        content: text
      };
    } catch (err) {
      return {
        ...entry,
        success: false,
        error: err.message
      };
    }
  }));

  res.json({ results });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Running on ${port}`));
