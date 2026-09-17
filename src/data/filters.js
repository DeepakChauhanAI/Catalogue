import { CATALOG_DATA } from './catalogData.js';

export function filterProducts(products, { domain = 'all', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return products.filter(p => {
    if (domain !== 'all' && p.domain !== domain) return false;
    if (q && !(p.name + ' ' + p.tagline + ' ' + p.arch + ' ' + p.category).toLowerCase().includes(q)) return false;
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
  const failures = [];

  // 1. Domain filters return products
  for (const domain of ['all', 'healthcare', 'infosec']) {
    if (filterProducts(products, { domain }).length === 0) {
      failures.push(`domain "${domain}" returns zero products`);
    }
  }

  // 2. Every project has a complete 3-tier demoFlow with well-formed values
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

  // 3. Dynamic rendering guard: toggle patterns differ across projects, so the
  //    client card's render-only-enabled-tiles logic is actually exercised
  const patterns = new Set(products.map(p =>
    `${p.demoFlow.completeFlow.enabled}|${p.demoFlow.demoVideo.enabled}|${p.demoFlow.contactDemo.enabled}`));
  if (patterns.size < 2) failures.push('all projects share one demo-mode pattern — dynamic rendering untested');

  // 4. Repository/links tracking exists for the Admin persona
  for (const p of products) {
    if (!p.repository?.branch) failures.push(`${p.id}: repository.branch missing`);
    if (!('productionUrl' in (p.links ?? {}))) failures.push(`${p.id}: links.productionUrl missing`);
  }

  if (failures.length) {
    console.error('FAIL\n  ' + failures.join('\n  '));
    process.exitCode = 1;
  } else {
    console.log(`PASS — ${products.length} products, demoFlow schemas valid, ${patterns.size} toggle patterns`);
  }
}

// Browser-safe main-module guard: in Node, compare against the argv path as a
// real URL (handles drive letters, spaces, percent-encoding); in the browser
// bundle `process` doesn't exist and the typeof check short-circuits.
const invokedDirectly =
  typeof process !== 'undefined' &&
  process.argv[1] &&
  import.meta.url === new URL('file:///' + process.argv[1].replace(/\\/g, '/')).href;

if (invokedDirectly) demo();
