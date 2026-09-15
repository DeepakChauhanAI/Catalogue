import { CATALOG_DATA } from './catalogData.js';

export function filterProducts(products, { domain = 'all', tag = 'All', query = '' } = {}) {
  const q = query.trim().toLowerCase();
  return products.filter(p => {
    if (domain !== 'all' && p.domain !== domain) return false;
    if (tag !== 'All' && !p.tags.includes(tag)) return false;
    if (q && !(p.name + ' ' + p.tagline + ' ' + p.arch).toLowerCase().includes(q)) return false;
    return true;
  });
}

export function allTags(products) {
  return ['All', ...new Set(products.flatMap(p => p.tags))];
}

// ponytail: redaction is one shared boundary; per-component guards if products grow custom views
export function redactDeployments(deployments, mode) {
  if (mode === 'presenter') return deployments;
  return deployments.map(({ pass, ...rest }) => rest);
}

export function demo() {
  const products = Object.values(CATALOG_DATA);
  const failures = [];

  // 1. Every tag chip matches at least one product
  for (const tag of allTags(products)) {
    if (tag === 'All') continue;
    if (filterProducts(products, { tag }).length === 0) {
      failures.push(`tag "${tag}" matches zero products`);
    }
  }

  // 2. Domain filters return products when tag = All
  for (const domain of ['all', 'healthcare', 'infosec']) {
    if (filterProducts(products, { domain }).length === 0) {
      failures.push(`domain "${domain}" returns zero products`);
    }
  }

  // 3. Shared mode never carries a pass field
  for (const p of products) {
    const redacted = redactDeployments(p.deployments, 'shared');
    if (redacted.some(d => 'pass' in d)) {
      failures.push(`${p.id}: shared-mode deployment still has a pass field`);
    }
  }

  // 4. Every deployment has a name and env label
  for (const p of products) {
    for (const d of p.deployments) {
      if (!d.name || !d.env) failures.push(`${p.id}: deployment missing name/env`);
    }
  }

  if (failures.length) {
    console.error('FAIL\n  ' + failures.join('\n  '));
    process.exitCode = 1;
  } else {
    console.log(`PASS — ${products.length} products, ${allTags(products).length - 1} tags, all checks green`);
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
