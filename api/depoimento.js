export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nome, empresa, texto, videoUrl, tipo } = req.body;

  const emoji  = tipo === 'video' ? '🎥' : '✍️';
  const nomeEx = nome || 'Anônimo';
  const taskName = `${emoji} [DEPOIMENTO] ${nomeEx}${empresa ? ' — ' + empresa : ''}`;

  const description = [
    `[META]`,
    `nome: ${nomeEx}`,
    `empresa: ${empresa || ''}`,
    `tipo: ${tipo || 'texto'}`,
    `videoUrl: ${videoUrl || ''}`,
    `[/META]`,
    ``,
    texto
      ? `"${texto}"`
      : `*(depoimento em vídeo — assista em: ${videoUrl})*`,
  ].join('\n');

  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_TESTIMONIALS_LIST_ID;

  if (!apiKey || !listId) {
    console.warn('ClickUp not configured');
    return res.status(200).json({ success: true, warning: 'ClickUp not configured' });
  }

  try {
    const r = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
      method: 'POST',
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: taskName,
        description,
        priority: 3,
        tags: ['depoimento', tipo === 'video' ? 'video' : 'texto'],
      }),
    });

    if (!r.ok) {
      const err = await r.text();
      console.error('ClickUp error:', err);
      return res.status(200).json({ success: true, clickup_error: err });
    }

    const task = await r.json();
    return res.status(200).json({ success: true, task_id: task.id });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true, error: err.message });
  }
}
