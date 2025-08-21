import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'candidato',
  password: 'avaliacao1234',
  database: 'talkdb',
});

async function test() {
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    await client.end();
  } catch (err) {
    console.error('❌ Connection failed:', err);
  }
}

test().catch(console.error);
