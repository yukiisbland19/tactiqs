import { neon } from '@neondatabase/serverless';
import { createRemoteJWKSet, jwtVerify } from 'jose';

let jwks;
function getJwks() {
  const url = process.env.NEON_AUTH_JWKS_URL;
  if (!url) throw new Error('NEON_AUTH_JWKS_URL is missing. Reconnect the Neon Auth integration.');
  if (!jwks) jwks = createRemoteJWKSet(new URL(url));
  return jwks;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({error:'Method not allowed'});
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) return res.status(401).json({error:'Please log in to access cloud saves.'});
    const {payload} = await jwtVerify(token, getJwks());
    const userId = payload.sub;
    if (!userId) return res.status(401).json({error:'Invalid account token.'});
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing. Connect Neon to this Vercel project.');
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS markaroni_careers (
      user_id TEXT PRIMARY KEY,
      career JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    if (req.method === 'GET') {
      const rows = await sql`SELECT career, updated_at FROM markaroni_careers WHERE user_id = ${userId} LIMIT 1`;
      return res.status(200).json({career: rows[0]?.career || null, updatedAt: rows[0]?.updated_at || null});
    }
    const career = req.body?.career;
    if (!career || typeof career !== 'object' || !Array.isArray(career.clubs)) return res.status(400).json({error:'Invalid career save.'});
    const serialized = JSON.stringify(career);
    if (serialized.length > 4_000_000) return res.status(413).json({error:'Career save is too large (4 MB maximum).'});
    await sql`INSERT INTO markaroni_careers (user_id, career, updated_at)
      VALUES (${userId}, ${serialized}::jsonb, NOW())
      ON CONFLICT (user_id) DO UPDATE SET career = EXCLUDED.career, updated_at = NOW()`;
    return res.status(200).json({ok:true, updatedAt:new Date().toISOString()});
  } catch (err) {
    console.error('Markaroni career API:', err);
    return res.status(500).json({error:'Cloud save service error. Your local browser save is still available.'});
  }
}
