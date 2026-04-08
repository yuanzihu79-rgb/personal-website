/* ============================================
   元芷 AI Portfolio - 主交互逻辑 v2.0
   ============================================ */

// --- 导航栏滚动效果 ---
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// --- 移动端导航菜单 ---
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// --- 粒子背景 ---
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const colors = ['rgba(108,92,231,0.5)', 'rgba(0,210,255,0.4)', 'rgba(255,107,107,0.4)', 'rgba(255,215,0,0.3)'];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    // 画连线
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(108,92,231,${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// --- 数字计数动画 ---
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        requestAnimationFrame(update);
      } else {
        counter.textContent = target + '+';
      }
    };
    update();
  });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  observer.observe(heroStats);
}

// --- 渲染工具箱 ---
function renderTools() {
  const grid = document.getElementById('toolsGrid');
  if (!grid || typeof toolsData === 'undefined') return;
  grid.innerHTML = toolsData.map((tool, i) => `
    <div class="tool-card" data-animate="${i % 2 === 0 ? 'left' : 'right'}">
      <div class="tool-icon">${tool.icon}</div>
      <div class="tool-name">${tool.name}</div>
      <div class="tool-desc">${tool.desc}</div>
    </div>
  `).join('');
}

// --- 渲染首页案例精选 ---
function renderCasesPreview() {
  const grid = document.getElementById('casesPreviewGrid');
  if (!grid || typeof casesData === 'undefined') return;
  grid.innerHTML = casesData.map(c => `
    <a href="case-detail.html?id=${c.id}" class="case-card">
      <div class="case-cover" style="${c.cover ? 'background-image:url(' + c.cover + ');background-size:cover;background-position:center;' : ''}"></div>
      <div class="case-body">
        <span class="case-tag ${c.tag}">${c.tagText}</span>
        <h3 class="case-title">${c.title}</h3>
        <p class="case-summary">${c.summary}</p>
        <div class="case-result">${c.result}</div>
        <span class="case-link">查看详情 &rarr;</span>
      </div>
    </a>
  `).join('');
}

// --- 渲染案例列表页 ---
function renderCasesList(filter) {
  const grid = document.getElementById('casesListGrid');
  if (!grid || typeof casesData === 'undefined') return;
  const filtered = filter === 'all' ? casesData : casesData.filter(c => c.tag === filter);
  grid.innerHTML = filtered.map(c => `
    <a href="case-detail.html?id=${c.id}" class="case-card">
      <div class="case-cover" style="${c.cover ? 'background-image:url(' + c.cover + ');background-size:cover;background-position:center;' : ''}"></div>
      <div class="case-body">
        <span class="case-tag ${c.tag}">${c.tagText}</span>
        <h3 class="case-title">${c.title}</h3>
        <p class="case-summary">${c.summary}</p>
        <div class="case-result">${c.result}</div>
        <span class="case-link">查看详情 &rarr;</span>
      </div>
    </a>
  `).join('');
}

function initFilterTabs() {
  const tabs = document.querySelectorAll('.filter-tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderCasesList(tab.getAttribute('data-filter'));
    });
  });
}

// --- 渲染案例详情页 ---
function renderCaseDetail() {
  const container = document.getElementById('caseDetailContent');
  if (!container || typeof casesData === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const caseItem = casesData.find(c => c.id === id);
  if (!caseItem) { container.innerHTML = '<p>案例不存在</p>'; return; }
  document.title = caseItem.title + ' - 元芷 AI';
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbTitle) breadcrumbTitle.textContent = caseItem.title;

  container.innerHTML = `
    <div class="case-detail-header">
      <span class="case-tag ${caseItem.tag}">${caseItem.tagText}</span>
      <h1 class="case-detail-title">${caseItem.title}</h1>
      <div class="case-meta">
        <div class="case-meta-item"><div class="case-meta-label">行业</div><div class="case-meta-value">${caseItem.industry}</div></div>
        <div class="case-meta-item"><div class="case-meta-label">周期</div><div class="case-meta-value">${caseItem.duration}</div></div>
        <div class="case-meta-item"><div class="case-meta-label">工具</div><div class="case-meta-value">${caseItem.tools[0]}</div></div>
      </div>
    </div>
    ${caseItem.cover ? `<img src="${caseItem.cover}" alt="${caseItem.title}" class="case-detail-cover">` : ''}
    <div class="case-detail-section"><h2>项目背景</h2><p>${caseItem.background}</p></div>
    <div class="case-detail-section"><h2>解决方案</h2><p>${caseItem.solution}</p></div>
    <div class="case-detail-section"><h2>使用工具</h2><div class="case-tools-used">${caseItem.tools.map(t => `<span class="case-tool-tag">${t}</span>`).join('')}</div></div>
    <div class="case-detail-section"><h2>落地效果</h2><div class="case-results-grid">${caseItem.results.map(r => `<div class="case-result-card"><div class="case-result-number">${r.number}</div><div class="case-result-label">${r.label}</div></div>`).join('')}</div></div>
    ${caseItem.feedback ? `<div class="case-detail-section"><h2>客户评价</h2><p style="font-style:italic;color:var(--color-text-secondary);">"${caseItem.feedback}"</p></div>` : ''}
    <div class="case-cta"><p>对这个方案感兴趣？</p><a href="index.html#contact" class="btn btn-primary"><span>立即咨询</span><div class="btn-glow"></div></a></div>
  `;

  const navEl = document.getElementById('caseNav');
  if (navEl) {
    const idx = casesData.findIndex(c => c.id === id);
    const prev = idx > 0 ? casesData[idx - 1] : null;
    const next = idx < casesData.length - 1 ? casesData[idx + 1] : null;
    navEl.innerHTML = `
      ${prev ? `<a href="case-detail.html?id=${prev.id}">&larr; ${prev.title}</a>` : '<span></span>'}
      ${next ? `<a href="case-detail.html?id=${next.id}">${next.title} &rarr;</a>` : '<span></span>'}
    `;
  }
}

// --- 渲染知识库列表 ---
function renderWikiList(filter) {
  const list = document.getElementById('wikiList');
  if (!list || typeof wikiData === 'undefined') return;
  const filtered = filter === 'all' ? wikiData : wikiData.filter(w => w.category === filter);
  list.innerHTML = filtered.map(w => `
    <a href="wiki-detail.html?id=${w.id}" class="wiki-article-card">
      <div class="wiki-article-meta">
        <span class="wiki-article-category">${w.categoryText}</span>
        <span class="wiki-article-date">${w.date}</span>
      </div>
      <h3 class="wiki-article-title">${w.title}</h3>
      <p class="wiki-article-desc">${w.desc}</p>
    </a>
  `).join('');
}

function initWikiSidebar() {
  const links = document.querySelectorAll('.wiki-category a[data-filter]');
  if (!links.length) return;
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      renderWikiList(link.getAttribute('data-filter'));
    });
  });
}

// --- 渲染知识库文章详情 ---
function renderWikiDetail() {
  const body = document.getElementById('wikiArticleBody');
  const tocEl = document.getElementById('wikiToc');
  if (!body || typeof wikiData === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const article = wikiData.find(w => w.id === id);
  if (!article) { body.innerHTML = '<p>文章不存在</p>'; return; }
  document.title = article.title + ' - 元芷 AI 知识库';
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbTitle) breadcrumbTitle.textContent = article.title;

  body.innerHTML = `
    <div class="wiki-article-meta" style="margin-bottom:16px;">
      <span class="wiki-article-category">${article.categoryText}</span>
      <span class="wiki-article-date">${article.date}</span>
    </div>
    <h1>${article.title}</h1>
    ${article.content}
    <div class="wiki-article-cta"><p>觉得有帮助？扫码领取更多教程</p><img src="assets/images/qrcode.jpg" alt="微信二维码"></div>
  `;

  if (tocEl && article.toc) {
    tocEl.innerHTML = `<div class="wiki-toc-title">目录</div>${article.toc.map(t => `<a href="#${t.id}">${t.text}</a>`).join('')}`;
  }

  const navEl = document.getElementById('wikiNav');
  if (navEl) {
    const idx = wikiData.findIndex(w => w.id === id);
    const prev = idx > 0 ? wikiData[idx - 1] : null;
    const next = idx < wikiData.length - 1 ? wikiData[idx + 1] : null;
    navEl.innerHTML = `
      ${prev ? `<a href="wiki-detail.html?id=${prev.id}">&larr; ${prev.title}</a>` : '<span></span>'}
      ${next ? `<a href="wiki-detail.html?id=${next.id}">${next.title} &rarr;</a>` : '<span></span>'}
    `;
  }
}

// --- 滚动入场动画（多方向） ---
function initScrollAnimations() {
  // 处理 data-animate 属性的元素
  const animatedEls = document.querySelectorAll('[data-animate]');
  const dirObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        dirObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(el => dirObserver.observe(el));

  // 处理普通卡片的淡入动画
  const cards = document.querySelectorAll('.tool-card:not([data-animate]), .case-card, .wiki-article-card, .service-card:not([data-animate])');
  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  cards.forEach((el, i) => {
    if (isInViewport(el)) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 80);
    } else {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    }
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(el => { if (!isInViewport(el)) cardObserver.observe(el); });
}

// --- 页面初始化 ---
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderTools();
  renderCasesPreview();
  renderCasesList('all');
  initFilterTabs();
  renderCaseDetail();
  renderWikiList('all');
  initWikiSidebar();
  renderWikiDetail();
  setTimeout(initScrollAnimations, 100);
});
