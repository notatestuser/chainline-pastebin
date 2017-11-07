const express = require('express');
const next = require('next');
const pick = require('pedantic-pick');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const svgCaptcha = require('svg-captcha');
const PastebinAPI = require('pastebin-js');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

['PASTEBIN_DEV_KEY', 'SESSION_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`The environment variable ${key} must be defined`);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception', err);
});

const pastebin = new PastebinAPI(process.env.PASTEBIN_DEV_KEY);

app.prepare()
  .then(() => {
    const server = express();

    // == MIDDLEWARE ==

    const sessionConfig = {
      name: 'pastebin_session',
      keys: [process.env.SESSION_SECRET],
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };

    if (server.get('env') === 'production') {
      server.set('trust proxy', 1); // trust first proxy
      sessionConfig.secure = true; // serve secure cookies
    }

    server.use(bodyParser.json());
    server.use(session(sessionConfig));

    // == PAGES ==

    server.get('/p(aste)?/:id/:hash?', (req, res) => {
      const actualPage = '/view';
      app.render(req, res, actualPage, Object.assign({}, req.params, req.query));
    });

    // == API ==

    server.get('/captcha', (req, res) => {
      const captcha = svgCaptcha.create();
      req.session.captcha = captcha.text;
      res.status(200).type('svg').end(captcha.data);
    });

    server.get('/api/paste/:id', async (req, res) => {
      try {
        const { id } = pick(req.params, '!nempstring::id');
        if (id.length < 3 || id.length > 32) {
          throw new Error('The given id appears to be invalid');
        }
        const text = await pastebin.getPaste(id);
        if (!text) {
          throw new Error('no response from server');
        }
        res.json({ ok: true, text });
      } catch (err) {
        res.status(404).json({
          ok: false,
          error: `Oops, ${(err && err.message) || 'an error occurred'}.`,
        });
      }
    });

    server.post('/api/paste', async (req, res) => {
      try {
        const {
          text, title, privacy, expiry, captcha,
        } = pick(req.body, '!nes::title', '!nes::text', '!num::privacy', '!nes::expiry', '!nes::captcha');
        if (captcha !== req.session.captcha) {
          console.error('Invalid captcha response!', `Got: ${captcha}`, `Expected: ${req.session.captcha}`);
          res.status(500).json({
            ok: false,
            error: 'Invalid captcha response!',
          });
          return;
        }
        const url = await pastebin.createPaste({
          text, title, privacy, expiration: expiry, format: 'text',
        });
        const [id] = url.match(/[a-z0-9]+$/i);
        res.json({ ok: true, id });
      } catch (err) {
        res.status(500).json({
          ok: false,
          error: `Oops, ${(err && err.message) || 'an error occurred'}.`,
        });
      }
    });

    server.get('*', (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`)
    });
  });
