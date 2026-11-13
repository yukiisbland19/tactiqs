export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const authUrl = process.env.NEON_AUTH_BASE_URL || process.env.NEON_AUTH_URL || '';
  if (!authUrl) return res.status(503).json({ error: 'Connect the Neon integration and enable Managed Better Auth in your Vercel project.' });
  return res.status(200).json({ authUrl });
}
