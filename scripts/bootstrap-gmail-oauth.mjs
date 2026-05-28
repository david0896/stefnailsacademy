// scripts/bootstrap-gmail-oauth.mjs
//
// Script de mantenimiento — UNA-y-rara-vez:
// Genera un refresh_token nuevo de Gmail OAuth2 cuando el actual caduca.
//
// USO:
//   1. Asegurate que CLIENT_ID y CLIENT_SECRET están en .env.local
//   2. En Google Cloud Console → APIs & Services → Credentials → tu OAuth
//      client → "Authorized redirect URIs" añadí:
//          http://localhost:7777/oauth/callback
//      y guardá.
//   3. Corré:
//          node --env-file=.env.local scripts/bootstrap-gmail-oauth.mjs
//   4. Abrí en el navegador la URL de consentimiento que imprime el script.
//      Firmá con la cuenta que ENVIARÁ los correos (soportestefnailsacademy@...).
//      Click en "Permitir".
//   5. El script imprime el refresh_token. Pegalo:
//        - en .env.local (REFRESH_TOKEN=...)
//        - en Vercel (Production y Preview, misma variable)
//   6. Verificá con `node --env-file=.env.local scripts/check-gmail-oauth.mjs`
//      (si lo conservás), o probando el flujo de inscripción.
//
// Notas:
//   - prompt:'consent' fuerza la pantalla de consentimiento para asegurar
//     que Google emita un refresh_token nuevo.
//   - Si Google no devuelve refresh_token: revocá la app en
//     https://myaccount.google.com/permissions con la cuenta de soporte
//     y volvé a correr.
//   - Si la app OAuth sigue en "Testing mode" en GCP, los tokens caducan
//     a los 7 días. Publicarla evita el problema de raíz.

import http from 'http';
import { google } from 'googleapis';

const PORT = 7777;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;
const SCOPES = ['https://mail.google.com/']; // scope necesario para SMTP via nodemailer

const clientId     = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('❌ Faltan CLIENT_ID y/o CLIENT_SECRET en el env');
  process.exit(1);
}

const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, REDIRECT_URI);

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',  // sin esto, Google NO devuelve refresh_token
  prompt: 'consent',        // fuerza re-emisión del refresh_token
  scope: SCOPES,
});

console.log('\n════════════════════════════════════════════════════════════');
console.log('  BOOTSTRAP de refresh_token de Gmail');
console.log('════════════════════════════════════════════════════════════');
console.log('\nVerificá que en Google Cloud Console, en "Authorized redirect URIs"');
console.log('del OAuth client, esté agregado:');
console.log(`    ${REDIRECT_URI}`);
console.log('\nLuego abrí esta URL en tu navegador (en una sesión con la cuenta');
console.log('que envía los correos — soportestefnailsacademy@gmail.com):\n');
console.log(authUrl);
console.log('\n────────────────────────────────────────────────────────────\n');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/oauth/callback') {
    res.writeHead(404).end('Not found');
    return;
  }

  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<h1>Error: ${error}</h1><p>Revisá la terminal.</p>`);
    console.error(`\n❌ Error en consentimiento: ${error}`);
    server.close();
    process.exit(2);
  }

  if (!code) {
    res.writeHead(400).end('Falta el code en la query');
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <html><body style="font-family:sans-serif; padding:40px; text-align:center;">
        <h1 style="color:#16a34a;">✅ Listo</h1>
        <p>Token recibido. Volvé a la terminal para copiar el <code>refresh_token</code>.</p>
        <p style="color:#6b7280;">Ya podés cerrar esta pestaña.</p>
      </body></html>
    `);

    console.log('\n✅ Tokens recibidos de Google:');
    console.log('   access_token (~1h):', (tokens.access_token || '').slice(0, 24) + '...');

    if (tokens.refresh_token) {
      console.log('\n╔════════════════════════════════════════════════════════════╗');
      console.log('║  🔑 NUEVO REFRESH_TOKEN — pegalo en .env.local y en Vercel: ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('\n' + tokens.refresh_token + '\n');
      console.log('Asegurate de actualizar:');
      console.log('  • .env.local           → REFRESH_TOKEN=<el valor de arriba>');
      console.log('  • Vercel env (Prod)    → REFRESH_TOKEN=<el valor de arriba>');
      console.log('  • Vercel env (Preview) → REFRESH_TOKEN=<el valor de arriba>');
    } else {
      console.warn('\n⚠️  Google NO devolvió refresh_token.');
      console.warn('   Esto suele pasar si ya habías dado consentimiento antes.');
      console.warn('   Para forzar uno nuevo:');
      console.warn('   1. Andá a https://myaccount.google.com/permissions');
      console.warn('   2. Buscá tu app (Stef Nails / OAuth) y "Quitar acceso"');
      console.warn('   3. Volvé a correr este script');
    }

    server.close();
    setTimeout(() => process.exit(0), 300);
  } catch (err) {
    console.error('\n❌ Falló el intercambio code→tokens:', err?.response?.data || err?.message || err);
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Error en el servidor. Revisá la terminal.</h1>');
    server.close();
    process.exit(3);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor local escuchando en ${REDIRECT_URI}`);
  console.log('Esperando que abrás la URL de consentimiento y des "Permitir"...\n');
});
