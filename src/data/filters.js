import { CATALOG_DATA, RESEARCH_DATA, normalizeDeliverables } from './catalogData.js';

export function filterProducts(products, { domain = 'all', status = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return products.filter(p => {
    if (domain !== 'all' && p.domain !== domain) return false;
    if (status !== 'all' && (p.lifecycle?.status || 'active') !== status) return false;
    if (q) {
      const basicText = (
        (p.name || '') + ' ' +
        (p.tagline || '') + ' ' +
        (p.arch || '') + ' ' +
        (p.category || '') + ' ' +
        (p.lifecycle?.statusNote || '') + ' ' +
        (p.tags || []).join(' ')
      ).toLowerCase();

      // Check presentation titles / notes
      const pptsText = (p.collateral?.presentations || [])
        .map(ppt => `${ppt.title} ${ppt.notes || ''}`)
        .join(' ')
        .toLowerCase();

      // Check sharepoint docs
      const spText = (p.collateral?.sharepoint || [])
        .map(sp => `${sp.title} ${sp.notes || ''}`)
        .join(' ')
        .toLowerCase();

      const combined = `${basicText} ${pptsText} ${spText}`;
      if (!combined.includes(q)) return false;
    }
    return true;
  });
}

export function filterResearches(researches, { domain = 'all', status = 'all', type = 'all', projectId = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return researches.filter(r => {
    if (domain !== 'all' && r.domain !== domain) return false;
    if (status !== 'all' && r.status !== status) return false;
    if (type !== 'all' && r.type !== type) return false;
    if (projectId !== 'all' && r.projectId !== projectId && !(r.relatedProjects || []).includes(projectId)) return false;
    if (q) {
      const findingsText = (r.keyTakeaways || r.keyFindings || []).join(' ');
      const researchersText = (r.leadResearchers || []).join(' ') + ' ' + (r.author || '');
      const tagsText = (r.tags || []).join(' ');
      const decisionText = r.decision || '';
      const contextText = r.context || r.abstract || '';
      const projText = r.projectName || '';
      const target = `${r.title} ${r.code} ${contextText} ${findingsText} ${researchersText} ${decisionText} ${projText} ${tagsText}`.toLowerCase();
      if (!target.includes(q)) return false;
    }
    return true;
  });
}

const TIMESTAMP = /^\d+:[0-5]\d$/;
const toSeconds = (ts) => {
  const [m, s] = ts.split(':').map(Number);
  return m * 60 + s;
};

export function demo() {
  const products = Object.values(CATALOG_DATA);
  const researches = Object.values(RESEARCH_DATA);
  const failures = [];

  // 1. Domain filters return products
  for (const domain of ['all', 'healthcare', 'infosec']) {
    if (filterProducts(products, { domain }).length === 0) {
      failures.push(`domain "${domain}" returns zero products`);
    }
  }

  // 2. Lifecycle filter check
  for (const status of ['active', 'on-hold']) {
    if (filterProducts(products, { status }).length === 0) {
      failures.push(`lifecycle status "${status}" returns zero products`);
    }
  }

  // 3. Every project has a complete 3-tier demoFlow with well-formed values
  for (const p of products) {
    const df = p.demoFlow;
    if (typeof df?.completeFlow?.enabled !== 'boolean') {
      failures.push(`${p.id}: completeFlow.enabled missing or not boolean`);
    }
    if (typeof df?.demoVideo?.enabled !== 'boolean') {
      failures.push(`${p.id}: demoVideo.enabled missing or not boolean`);
    }
    if (typeof df?.contactDemo?.enabled !== 'boolean') {
      failures.push(`${p.id}: contactDemo.enabled missing or not boolean`);
    }
    if (!df?.completeFlow?.sandboxUrl) failures.push(`${p.id}: completeFlow.sandboxUrl missing`);
    if (!df?.contactDemo?.inquiryEmail) failures.push(`${p.id}: contactDemo.inquiryEmail missing`);
    if (!p.category || !p.lastUpdated) failures.push(`${p.id}: card metadata (category/lastUpdated) missing`);

    const { videoDuration, chapters } = df?.demoVideo ?? {};
    if (!TIMESTAMP.test(videoDuration ?? '')) {
      failures.push(`${p.id}: videoDuration "${videoDuration}" not M:SS`);
    }
    for (const c of chapters ?? []) {
      if (!TIMESTAMP.test(c.timestamp)) failures.push(`${p.id}: chapter timestamp "${c.timestamp}" not M:SS`);
      if (!c.title) failures.push(`${p.id}: chapter missing title`);
    }
    const stamps = (chapters ?? []).map(c => toSeconds(c.timestamp));
    if (stamps.some((s, i) => i > 0 && s <= stamps[i - 1])) {
      failures.push(`${p.id}: chapter timestamps not strictly ascending`);
    }

    // Enabled video must point somewhere playable
    if (df?.demoVideo?.enabled && !df.demoVideo.videoUrl && !df.demoVideo.videoFileName) {
      failures.push(`${p.id}: demo video enabled but has no URL or uploaded file`);
    }
  }

  // 4. Dynamic rendering guard: toggle patterns differ across projects
  const patterns = new Set(products.map(p =>
    `${p.demoFlow.completeFlow.enabled}|${p.demoFlow.demoVideo.enabled}|${p.demoFlow.contactDemo.enabled}`));
  if (patterns.size < 2) failures.push('all projects share one demo-mode pattern — dynamic rendering untested');

  // 5. Repository/links tracking exists for the Admin persona
  for (const p of products) {
    if (!p.repository?.branch) failures.push(`${p.id}: repository.branch missing`);
    if (!('productionUrl' in (p.links ?? {}))) failures.push(`${p.id}: links.productionUrl missing`);
  }

  // 6. Research schema validation
  for (const r of researches) {
    if (!r.title || !r.code || !r.abstract) failures.push(`research ${r.id}: title, code, or abstract missing`);
    const delivs = normalizeDeliverables(r.deliverables);
    if (delivs.length === 0 && !r.deliverables?.sharepointFolder) failures.push(`research ${r.id}: deliverables missing`);
  }

  if (failures.length) {
    console.error('FAIL\n  ' + failures.join('\n  '));
    process.exitCode = 1;
  } else {
    console.log(`PASS — ${products.length} products verified, ${researches.length} research studies validated, ${patterns.size} toggle patterns`);
  }
}

const invokedDirectly =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  import.meta.url === new URL('file:///' + process.argv[1].replace(/\\/g, '/')).href;

if (invokedDirectly) demo();
