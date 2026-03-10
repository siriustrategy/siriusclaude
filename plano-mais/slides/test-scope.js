const { google } = require('googleapis');
const fs = require('fs');

const creds = JSON.parse(fs.readFileSync(process.env.HOME + '/.clasprc.json')).tokens.default;
const auth = new google.auth.OAuth2(creds.client_id, creds.client_secret);
auth.setCredentials({ access_token: creds.access_token, refresh_token: creds.refresh_token });

const slidesApi = google.slides({ version: 'v1', auth });

async function test() {
  const res = await slidesApi.presentations.create({ requestBody: { title: 'Teste Scope' } });
  console.log('✅ Funcionou! ID:', res.data.presentationId);
}
test().catch(e => console.log('❌ Erro:', e.message));
