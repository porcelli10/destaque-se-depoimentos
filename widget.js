(function () {
  var API_URL = 'https://destaque-se-depoimentos.vercel.app/api/vitrine';
  var ACCENT  = '#7B35E8';
  var ACCENT2 = '#9D5FFF';
  var BG      = '#08060f';
  var SURFACE = '#100c1e';
  var DIM     = '#2a1f45';
  var TEXT    = '#e8e0f5';
  var MUTED   = '#7a6a9a';

  /* ── CSS injetado uma única vez ── */
  if (!document.getElementById('dse-widget-style')) {
    var style = document.createElement('style');
    style.id = 'dse-widget-style';
    style.textContent = [
      '#dse-vitrine *{box-sizing:border-box;margin:0;padding:0;}',
      '#dse-vitrine{font-family:"Inter",sans-serif;background:' + BG + ';color:' + TEXT + ';padding:4rem 1.5rem;position:relative;overflow:hidden;}',
      '#dse-vitrine::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(123,53,232,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(123,53,232,.04) 1px,transparent 1px);background-size:44px 44px;pointer-events:none;}',
      '.dse-heading{text-align:center;margin-bottom:2.5rem;position:relative;z-index:1;}',
      '.dse-heading h2{font-family:"Space Grotesk",sans-serif;font-size:clamp(1.4rem,3.5vw,2.2rem);font-weight:800;line-height:1.2;margin-bottom:.5rem;}',
      '.dse-heading h2 span{color:' + ACCENT2 + ';}',
      '.dse-heading p{color:' + MUTED + ';font-size:.95rem;max-width:460px;margin:0 auto .5rem;}',
      '.dse-stats{display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-bottom:2rem;}',
      '.dse-stat{text-align:center;}',
      '.dse-stat-num{font-family:"Space Grotesk",sans-serif;font-size:1.8rem;font-weight:800;color:' + ACCENT2 + ';line-height:1;}',
      '.dse-stat-label{font-size:.75rem;color:' + MUTED + ';margin-top:.2rem;}',
      '.dse-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.25rem;max-width:1200px;margin:0 auto;position:relative;z-index:1;}',
      '.dse-card{background:' + SURFACE + ';border:1px solid ' + DIM + ';border-radius:18px;overflow:hidden;transition:transform .2s,border-color .2s,box-shadow .2s;position:relative;}',
      '.dse-card::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,' + ACCENT2 + ',transparent);opacity:.3;}',
      '.dse-card:hover{transform:translateY(-4px);border-color:rgba(123,53,232,.4);box-shadow:0 12px 40px rgba(123,53,232,.15);}',
      /* vídeo: altura fixa + contain para não cortar */
      '.dse-vthumb{position:relative;height:320px;background:#000;cursor:pointer;overflow:hidden;display:flex;align-items:center;justify-content:center;}',
      '.dse-vthumb video{width:100%;height:100%;object-fit:contain;display:block;}',
      '.dse-play-btn{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(8,6,15,.45);transition:background .2s;}',
      '.dse-play-btn:hover{background:rgba(8,6,15,.25);}',
      '.dse-play-circle{width:56px;height:56px;background:' + ACCENT + ';border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(123,53,232,.5);transition:transform .2s;}',
      '.dse-vthumb:hover .dse-play-circle{transform:scale(1.1);}',
      '.dse-body{padding:1.25rem;}',
      '.dse-quote{font-family:"Space Grotesk",sans-serif;font-size:2.8rem;line-height:1;color:' + ACCENT + ';opacity:.2;margin-bottom:-.3rem;}',
      '.dse-text{font-size:.88rem;line-height:1.65;color:' + TEXT + ';margin-bottom:1rem;}',
      '.dse-author{display:flex;align-items:center;gap:.65rem;padding-top:.9rem;border-top:1px solid ' + DIM + ';}',
      '.dse-avatar{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,' + ACCENT + ',' + ACCENT2 + ');display:flex;align-items:center;justify-content:center;font-family:"Space Grotesk",sans-serif;font-size:.68rem;font-weight:700;color:#fff;}',
      '.dse-name{font-weight:600;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;}',
      '.dse-badge{flex-shrink:0;font-size:.6rem;padding:.18rem .45rem;border-radius:50px;}',
      '.dse-badge-v{background:rgba(123,53,232,.2);color:' + ACCENT2 + ';border:1px solid rgba(123,53,232,.3);}',
      '.dse-badge-t{background:rgba(255,200,0,.1);color:#ffc800;border:1px solid rgba(255,200,0,.25);}',
      '.dse-empty{text-align:center;padding:3rem 1rem;color:' + MUTED + ';grid-column:1/-1;}',
      '.dse-spinner{width:32px;height:32px;border:3px solid ' + DIM + ';border-top-color:' + ACCENT + ';border-radius:50%;animation:dseSpin .8s linear infinite;margin:2.5rem auto;}',
      /* modal */
      '.dse-modal-bg{display:none;position:fixed;inset:0;z-index:9999;background:rgba(8,6,15,.92);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:1.5rem;}',
      '.dse-modal-bg.open{display:flex;animation:dseFadeIn .25s ease;}',
      '.dse-modal{width:100%;max-width:480px;background:' + SURFACE + ';border:1px solid ' + DIM + ';border-radius:18px;overflow:hidden;}',
      '.dse-modal-head{display:flex;align-items:center;justify-content:space-between;padding:.9rem 1.1rem;border-bottom:1px solid ' + DIM + ';}',
      '.dse-modal-title{font-family:"Space Grotesk",sans-serif;font-size:.9rem;font-weight:600;}',
      '.dse-modal-close{width:30px;height:30px;background:#160f28;border:1px solid ' + DIM + ';border-radius:7px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:' + MUTED + ';transition:border-color .2s;font-size:1rem;line-height:1;}',
      '.dse-modal-close:hover{border-color:' + ACCENT + ';color:' + ACCENT2 + ';}',
      '.dse-modal video{width:100%;max-height:80vh;background:#000;display:block;object-fit:contain;}',
      '@keyframes dseSpin{to{transform:rotate(360deg);}}',
      '@keyframes dseFadeIn{from{opacity:0;}to{opacity:1;}}',
      '@keyframes dseFadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}',
    ].join('');
    document.head.appendChild(style);
  }

  /* ── helpers ── */
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
  function initials(nome) {
    if (!nome || nome === 'Anônimo') return '?';
    return nome.split(' ').slice(0,2).map(function(w){return w[0].toUpperCase();}).join('');
  }

  /* ── modal ── */
  var modal = document.createElement('div');
  modal.className = 'dse-modal-bg';
  modal.innerHTML = [
    '<div class="dse-modal">',
    '  <div class="dse-modal-head">',
    '    <span class="dse-modal-title" id="dse-modal-title">Depoimento em Vídeo</span>',
    '    <button class="dse-modal-close" id="dse-close">✕</button>',
    '  </div>',
    '  <video id="dse-modal-video" controls playsinline></video>',
    '</div>',
  ].join('');
  document.body.appendChild(modal);

  function openModal(url, nome) {
    document.getElementById('dse-modal-video').src = url;
    document.getElementById('dse-modal-title').textContent = 'Depoimento — ' + nome;
    modal.classList.add('open');
    document.getElementById('dse-modal-video').play();
  }
  function closeModal() {
    var v = document.getElementById('dse-modal-video');
    v.pause(); v.src = '';
    modal.classList.remove('open');
  }
  document.getElementById('dse-close').addEventListener('click', closeModal);
  modal.addEventListener('click', function(e){ if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeModal(); });

  /* ── build cards ── */
  function buildVideo(dep, idx) {
    var el = document.createElement('div');
    el.className = 'dse-card';
    el.style.animation = 'dseFadeUp .45s ease ' + (idx * 0.07) + 's both';
    el.innerHTML = [
      '<div class="dse-vthumb" data-url="' + esc(dep.videoUrl) + '" data-nome="' + esc(dep.nome) + '">',
      '  <video src="' + esc(dep.videoUrl) + '#t=0.5" preload="metadata" muted playsinline></video>',
      '  <div class="dse-play-btn">',
      '    <div class="dse-play-circle">',
      '      <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="dse-body">',
      '  <div class="dse-author">',
      '    <div class="dse-avatar">' + initials(dep.nome) + '</div>',
      '    <div class="dse-name">' + esc(dep.nome) + '</div>',
      '    <span class="dse-badge dse-badge-v">🎥 vídeo</span>',
      '  </div>',
      '</div>',
    ].join('');
    el.querySelector('.dse-vthumb').addEventListener('click', function() {
      openModal(this.dataset.url, this.dataset.nome);
    });
    return el;
  }

  function buildText(dep, idx) {
    var el = document.createElement('div');
    el.className = 'dse-card';
    el.style.animation = 'dseFadeUp .45s ease ' + (idx * 0.07) + 's both';
    var imgHtml = dep.imageUrl
      ? '<img src="' + esc(dep.imageUrl) + '" alt="foto" style="width:100%;border-radius:10px 10px 0 0;object-fit:cover;max-height:200px;display:block;">'
      : '';
    el.innerHTML = [
      imgHtml,
      '<div class="dse-body">',
      '  <div class="dse-quote">"</div>',
      '  <p class="dse-text">' + esc(dep.texto) + '</p>',
      '  <div class="dse-author">',
      '    <div class="dse-avatar">' + initials(dep.nome) + '</div>',
      '    <div class="dse-name">' + esc(dep.nome) + '</div>',
      '    <span class="dse-badge dse-badge-t">✍️ texto</span>',
      '  </div>',
      '</div>',
    ].join('');
    return el;
  }

  /* ── render ── */
  function render(target) {
    target.id = 'dse-vitrine';
    target.innerHTML = [
      '<div class="dse-heading">',
      '  <h2>O que nossos clientes <span>dizem</span></h2>',
      '  <p>Histórias reais de assistências técnicas que transformaram seu atendimento.</p>',
      '</div>',
      '<div class="dse-stats" id="dse-stats" style="display:none">',
      '  <div class="dse-stat"><div class="dse-stat-num" id="dse-total">0</div><div class="dse-stat-label">Depoimentos</div></div>',
      '  <div class="dse-stat"><div class="dse-stat-num" id="dse-videos">0</div><div class="dse-stat-label">Em vídeo</div></div>',
      '  <div class="dse-stat"><div class="dse-stat-num" id="dse-textos">0</div><div class="dse-stat-label">Escritos</div></div>',
      '</div>',
      '<div class="dse-spinner" id="dse-spinner"></div>',
      '<div class="dse-grid" id="dse-grid"></div>',
    ].join('');

    fetch(API_URL)
      .then(function(r){ return r.json(); })
      .then(function(items) {
        document.getElementById('dse-spinner').style.display = 'none';
        var grid = document.getElementById('dse-grid');

        if (!items.length) {
          grid.innerHTML = '<div class="dse-empty"><p>Nenhum depoimento disponível ainda.</p></div>';
          return;
        }

        document.getElementById('dse-stats').style.display = 'flex';
        document.getElementById('dse-total').textContent  = items.length;
        document.getElementById('dse-videos').textContent = items.filter(function(i){return i.tipo==='video';}).length;
        document.getElementById('dse-textos').textContent = items.filter(function(i){return i.tipo==='texto';}).length;

        items.forEach(function(dep, idx) {
          grid.appendChild(dep.tipo === 'video' ? buildVideo(dep, idx) : buildText(dep, idx));
        });
      })
      .catch(function() {
        document.getElementById('dse-spinner').style.display = 'none';
        document.getElementById('dse-grid').innerHTML = '<div class="dse-empty"><p>Não foi possível carregar os depoimentos.</p></div>';
      });
  }

  /* ── init ── */
  function init() {
    var placeholder = document.getElementById('dse-depoimentos');
    if (placeholder) {
      render(placeholder);
    } else {
      console.warn('[Destaque-se Widget] Adicione <div id="dse-depoimentos"></div> na página.');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
