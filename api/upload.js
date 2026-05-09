import { handleUpload } from '@vercel/blob/client';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ['video/webm', 'video/mp4', 'video/ogg', 'video/*'],
        maximumSizeInBytes: 200 * 1024 * 1024,
        tokenPayload: JSON.stringify({ pathname }),
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('Video upload completed:', blob.url);
      },
    });
    return res.json(jsonResponse);
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(400).json({ error: err.message });
  }
}
