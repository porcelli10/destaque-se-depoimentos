export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');

  const apiKey = process.env.CLICKUP_API_KEY;
  const listId = process.env.CLICKUP_TESTIMONIALS_LIST_ID;

  if (!apiKey || !listId) {
    return res.status(200).json([]);
  }

  try {
    const r = await fetch(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      { headers: { Authorization: apiKey } }
    );

    const data = await r.json();
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
        imageUrl:  meta.imageUrl || '',
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
