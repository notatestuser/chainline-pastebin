const express = require('express');
const next = require('next');
const pick = require('pedantic-pick');
const bodyParser = require('body-parser');
const PastebinAPI = require('pastebin-js');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

if (!process.env.PASTEBIN_DEV_KEY) {
  throw new Error('The environment variable PASTEBIN_DEV_KEY must be defined');
}
const pastebin = new PastebinAPI(process.env.PASTEBIN_DEV_KEY);

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

app
  .prepare()
  .then(() => {
    const server = express();
    server.use(bodyParser.json());

    server.get('/api/paste/:id', async (req, res) => {
      try {
        const { id } = pick(req.params, '!nempstring::id');
        if (id.length < 3 || id.length > 32) {
          throw new Error('The given id appears to be invalid');
        }
        const data = await pastebin.getPaste(id);
        res.json({ ok: true, data });
      } catch (err) {
        res.status(404).json({
          ok: false,
          error: err && err.message,
        });
      }
    });

    server.post('/api/paste', async (req, res) => {
      try {
        const {
          text, title, privacy, expiry,
        } = pick(req.body, '!nes::text', '!nes::title', '!num::privacy', '!nes::expiry');
        const url = await pastebin.createPaste({
          text, title, privacy, expiration: expiry, format: 'text',
        });
        const [id] = url.match(/[a-z0-9]+$/i);
        res.json({ ok: true, id });
      } catch (err) {
        res.status(500).json({
          ok: false,
          error: err && err.message,
        });
      }
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`)
    });
  });
