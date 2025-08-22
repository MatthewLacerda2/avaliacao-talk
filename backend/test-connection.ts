import { Client } from 'pg';

const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  user: 'candidato',
  password: 'av4li4cao',
  database: 'avaliacao',
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
