import React, { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import OverviewPane from './components/OverviewPane';
import DetailPane from './components/DetailPane';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import { CATALOG_DATA } from './data/catalogData';
import { filterProducts } from './data/filters';

const PRODUCTS = Object.values(CATALOG_DATA);
const idFromHash = () => decodeURIComponent(window.location.hash.slice(2)) || null;

export default function App() {
  const [domain, setDomain] = useState('all');
  const [tag, setTag] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(idFromHash);
  const [mode, setMode] = useState(() => localStorage.getItem('catalogue-mode') || 'shared');
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('catalogue-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState('');
  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('catalogue-theme', theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem('catalogue-mode', mode); }, [mode]);

  useEffect(() => {
    const onHash = () => setSelectedId(idFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        if (authOpen) { setAuthOpen(false); return; }
        if (document.activeElement === searchRef.current) { searchRef.current.blur(); return; }
        if (selectedId) window.location.hash = '#/';
        return;
      }
      if (/^[1-9]$/.test(e.key) && !/input|textarea|select/i.test(e.target.tagName)) {
        const p = PRODUCTS[Number(e.key) - 1];
        if (p) window.location.hash = `#/${p.id}`;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [authOpen, selectedId]);

  const filtered = useMemo(
    () => filterProducts(PRODUCTS, { domain, tag, query }),
    [domain, tag, query]);

  const selected = selectedId ? CATALOG_DATA[selectedId] : null;

  const lock = () => { setMode('shared'); showToast('Shared mode — credentials hidden'); };
  const unlock = () => setAuthOpen(true);

  return (
    <div className="shell">
      <Sidebar
        products={PRODUCTS}
        filtered={filtered}
        selectedId={selectedId}
        domain={domain} setDomain={setDomain}
        tag={tag} setTag={setTag}
        query={query} setQuery={setQuery}
        searchRef={searchRef}
        mode={mode} onLock={lock} onUnlock={unlock}
        theme={theme} onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />
      {selected ? (
        <DetailPane product={selected} mode={mode} onUnlock={unlock} showToast={showToast} />
      ) : (
        <OverviewPane
          products={PRODUCTS}
          filtered={filtered}
          filteredBy={domain !== 'all' || tag !== 'All' || query.trim()}
          onReset={() => { setDomain('all'); setTag('All'); setQuery(''); }}
        />
      )}
      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(false)}
          onSuccess={() => { setMode('presenter'); setAuthOpen(false); showToast('Presenter mode — credentials visible'); }}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
