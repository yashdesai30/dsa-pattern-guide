import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS support headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    // If not configured, we'll respond with 500 but detail it so the user knows what to configure.
    return res.status(500).json({ 
      error: 'DATABASE_URL environment variable is missing. Please configure Neon DB in Vercel or your local .env file.' 
    });
  }

  const sql = neon(databaseUrl);

  try {
    // 1. Create progress schema if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS dsa_progress (
        user_id VARCHAR(255) PRIMARY KEY,
        progress TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Fetch User Progress (GET)
    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'Missing userId parameter' });
      }

      const rows = await sql`SELECT progress FROM dsa_progress WHERE user_id = ${userId}`;
      if (rows.length === 0) {
        return res.status(200).json({ progress: {} });
      }
      return res.status(200).json({ progress: JSON.parse(rows[0].progress) });
    }

    // 3. Save User Progress (POST)
    if (req.method === 'POST') {
      const { userId, progress } = req.body;
      if (!userId || progress === undefined) {
        return res.status(400).json({ error: 'Missing userId or progress in request body' });
      }

      const progressStr = JSON.stringify(progress);

      await sql`
        INSERT INTO dsa_progress (user_id, progress, updated_at)
        VALUES (${userId}, ${progressStr}, NOW())
        ON CONFLICT (user_id)
        DO UPDATE SET progress = EXCLUDED.progress, updated_at = NOW();
      `;

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
