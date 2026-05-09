export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_TESTIMONIALS_LIST_ID;
  const debug = req.query.debug === '1';

  if (!apiKey || !listId) {
    return res.status(200).json(debug ? { error: 'missing_env', apiKey: !!apiKey, listId: !!listId } : []);
  }

  try {
    const url = `https://api.clickup.com/api/v2/list/${listId}/task?include_closed=true&order_by=date_created&reverse=true&page=0`;
    const r = await fetch(url, { headers: { Authorization: apiKey } });
    const data = await r.json();

    if (debug) return res.status(200).json({ url, status: r.status, rawTasks: (data.tasks || []).map(t => ({ id: t.id, name: t.name, status: t.status?.status })), err: data.err });

    const tasks = (data.tasks || []).filter(t => t.status?.status === 'aprovado');

    const depoimentos = tasks.map(task => {
      const meta = {};
      const match = (task.description || '').match(/\[META\]([\s\S]*?)\[\/META\]/);
      if (match) {
        match[1].split('\n').forEach(line => {
          const idx = line.indexOf(': ');
          if (idx > -1) {
            meta[line.slice(0, idx).trim()] = line.slice(idx + 2).trim();
          }
        });
      }

      const afterMeta = (task.description || '').split('[/META]')[1] || '';
      const texto = afterMeta.trim().replace(/^"|"$/g, '');

      return {
        id:        task.id,
        nome:      meta.nome   || 'Cliente',
        empresa:   meta.empresa || '',
        tipo:      meta.tipo   || 'texto',
        videoUrl:  meta.videoUrl || '',
        texto:     meta.tipo === 'video' && !texto ? '' : texto,
        criadoEm: task.date_created,
      };
    });

    return res.status(200).json(depoimentos);
  } catch (err) {
    console.error(err);
    return res.status(200).json([]);
  }
}
