// ONE-TIME setup: gives the server permission to create events on
// anoracounselling@gmail.com's Google Calendar and saves GOOGLE_REFRESH_TOKEN
// into server/.env.      Run:  npm run google-auth
import './env.js';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('Put GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env first (see SETUP.md, "Google Meet links").');
  process.exit(1);
}

const PORT = 5555;
const REDIRECT = `http://localhost:${PORT}/oauth2callback`;
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env');

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/calendar.events',
    access_type: 'offline',
    prompt: 'consent',
    login_hint: 'anoracounselling@gmail.com',
  });

const saveToken = (token) => {
  let text = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  const line = `GOOGLE_REFRESH_TOKEN=${token}`;
  text = /^GOOGLE_REFRESH_TOKEN=.*$/m.test(text)
    ? text.replace(/^GOOGLE_REFRESH_TOKEN=.*$/m, line)
    : `${text.replace(/\s*$/, '')}\n${line}\n`;
  fs.writeFileSync(envPath, text);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT);
  if (url.pathname !== '/oauth2callback') {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get('code');
  const page = (msg) => res.writeHead(200, { 'Content-Type': 'text/html' }).end(`<h2 style="font-family:Arial">${msg}</h2>`);
  if (!code) {
    page('Permission was not granted. You can close this tab and run the command again.');
    console.error('No authorisation code received:', url.searchParams.get('error'));
    return server.close();
  }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT,
        grant_type: 'authorization_code',
      }),
    });
    const data = await r.json();
    if (!data.refresh_token) throw new Error(data.error_description || 'Google did not return a refresh token. Remove the app at myaccount.google.com/permissions and try again.');
    saveToken(data.refresh_token);
    page('All done! You can close this tab and return to the terminal.');
    console.log('\nSUCCESS - GOOGLE_REFRESH_TOKEN saved to server/.env');
    console.log('Next: restart the server, then run  npm run test-calendar');
  } catch (e) {
    page('Something went wrong - see the terminal.');
    console.error('FAILED:', e.message);
  }
  server.close();
});

server.listen(PORT, () => {
  console.log('\nOpening Google sign-in. Sign in as anoracounselling@gmail.com and click Allow.');
  console.log('If the browser does not open, copy this link into it:\n\n' + authUrl + '\n');
  const open = process.platform === 'win32' ? `start "" "${authUrl}"` : process.platform === 'darwin' ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(open, () => {});
});
