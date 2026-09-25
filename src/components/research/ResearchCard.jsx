import React, { useState, useEffect, useRef } from 'react';
import {
  Bookmark,
  MoreHorizontal,
  Activity,
  Shield,
  ExternalLink,
  Pencil,
  Trash2,
  Users,
  Check,
  FileText,
  HeartPulse,
  Eye,
  Tag
} from 'lucide-react';
import { normalizeDeliverables } from '../../data/catalogData';

// Brand icons for deliverables matching the reference design
export function SharePointIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#038387" />
      <path
        d="M14.5 9.5C14.5 8.12 13.38 7 12 7C10.62 7 9.5 8.12 9.5 9.5C9.5 10.88 10.62 12 12 12C13.38 12 14.5 13.12 14.5 14.5C14.5 15.88 13.38 17 12 17C10.62 17 9.5 15.88 9.5 14.5"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PdfIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path d="M4 4C4 2.89543 4.89543 2 6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4Z" fill="#2563eb" />
      <path d="M14 2V8H20" fill="#93c5fd" />
      <path d="M8 12H16M8 16H13" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function GitHubIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#181717" style={{ flexShrink: 0 }}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017C2 16.446 4.87 20.198 8.84 21.52C9.34 21.614 9.52 21.303 9.52 21.036C9.52 20.798 9.51 19.974 9.51 19.136C6.73 19.74 6.14 17.794 6.14 17.794C5.68 16.634 5.03 16.326 5.03 16.326C4.12 15.706 5.1 15.719 5.1 15.719C6.1 15.79 6.63 16.745 6.63 16.745C7.52 18.271 8.96 17.831 9.53 17.575C9.62 16.927 9.88 16.485 10.16 16.237C7.94 15.986 5.6 15.127 5.6 11.303C5.6 10.213 5.99 9.324 6.63 8.627C6.53 8.375 6.19 7.362 6.73 6.002C6.73 6.002 7.57 5.733 9.48 7.026C10.28 6.804 11.14 6.693 12 6.689C12.86 6.693 13.72 6.804 14.52 7.026C16.43 5.733 17.27 6.002 17.27 6.002C17.81 7.362 17.47 8.375 17.37 8.627C18.01 9.324 18.4 10.213 18.4 11.303C18.4 15.138 16.05 15.983 13.82 16.229C14.18 16.541 14.5 17.151 14.5 18.083C14.5 19.426 14.49 20.509 14.49 20.838C14.49 21.109 14.67 21.424 15.18 21.32C19.14 19.99 22 16.242 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

// Vector Spot Illustrations matching the reference design
export function ResearchSpotIllustration({ type, domain, uniqueId, compact = false }) {
  const isHealth = domain === 'healthcare';
  const gradId = `halo-grad-${uniqueId || 'def'}`;
  const width = compact ? 70 : 86;
  const height = compact ? 62 : 76;

  if (type === 'derm-images' || (isHealth && type !== 'audio-wave' && type !== 'kiosk-touch')) {
    return (
      <div className={`research-spot-halo health ${compact ? 'compact' : ''}`}>
        <svg width={width} height={height} viewBox="0 0 90 80" fill="none">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#10b981" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="45" cy="40" r="38" fill={`url(#${gradId})`} />
          <rect x="22" y="14" width="46" height="38" rx="8" fill="#ffffff" stroke="#d1fae5" strokeWidth="1.5" transform="rotate(8 45 33)" />
          <rect x="18" y="17" width="46" height="38" rx="8" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
          <path d="M24 43L34 30L44 42L49 37L58 45H24V43Z" fill="#10b981" fillOpacity="0.75" />
          <circle cx="28" cy="25" r="3" fill="#34d399" />
          <circle cx="60" cy="52" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
          <path d="M60 48V56M56 52H64" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'pqc-shield' || (!isHealth && type !== 'stream-audit')) {
    return (
      <div className={`research-spot-halo sec ${compact ? 'compact' : ''}`}>
        <svg width={width} height={height} viewBox="0 0 90 80" fill="none">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`sg-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <circle cx="45" cy="40" r="38" fill={`url(#${gradId})`} />
          <ellipse cx="45" cy="40" rx="36" ry="14" stroke="#c7d2fe" strokeWidth="1.2" strokeDasharray="3 2" transform="rotate(-20 45 40)" />
          <circle cx="75" cy="30" r="2.5" fill="#6366f1" />
          <circle cx="16" cy="50" r="2" fill="#3b82f6" />
          <g transform="translate(14, 50) scale(0.65)">
            <path d="M10 0L20 6V18L10 24L0 18V6L10 0Z" fill="#93c5fd" />
            <path d="M10 0L20 6L10 12L0 6L10 0Z" fill="#bfdbfe" />
            <path d="M10 12L20 6V18L10 24V12Z" fill="#60a5fa" />
          </g>
          <path d="M45 18L61 24V38C61 48 54 57 45 61C36 57 29 48 29 38V24L45 18Z" fill={`url(#sg-${gradId})`} stroke="#ffffff" strokeWidth="1.5" />
          <rect x="41" y="34" width="8" height="7" rx="1.5" fill="#ffffff" />
          <path d="M42.5 34V31C42.5 29.6 43.6 28.5 45 28.5C46.4 28.5 47.5 29.6 47.5 31V34" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'audio-wave') {
    return (
      <div className={`research-spot-halo audio ${compact ? 'compact' : ''}`}>
        <svg width={width} height={height} viewBox="0 0 90 80" fill="none">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="45" cy="40" r="38" fill={`url(#${gradId})`} />
          <rect x="20" y="20" width="48" height="34" rx="10" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
          <path d="M30 54L26 62L36 54H30Z" fill="#ffffff" stroke="#bae6fd" strokeWidth="1.5" />
          <rect x="30" y="32" width="3" height="12" rx="1.5" fill="#0284c7" />
          <rect x="36" y="26" width="3" height="22" rx="1.5" fill="#0ea5e9" />
          <rect x="42" y="29" width="3" height="16" rx="1.5" fill="#38bdf8" />
          <rect x="48" y="24" width="3" height="26" rx="1.5" fill="#0284c7" />
          <rect x="54" y="33" width="3" height="10" rx="1.5" fill="#0ea5e9" />
          <circle cx="62" cy="50" r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
          <path d="M62 46V51M60 49C60 50.1 60.9 51 62 51C63.1 51 64 50.1 64 49M62 53V55M60 55H64" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (type === 'stream-audit') {
    return (
      <div className={`research-spot-halo sec ${compact ? 'compact' : ''}`}>
        <svg width={width} height={height} viewBox="0 0 90 80" fill="none">
          <defs>
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="70%" stopColor="#6366f1" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="45" cy="40" r="38" fill={`url(#${gradId})`} />
          <rect x="18" y="22" width="52" height="32" rx="6" fill="#ffffff" stroke="#c7d2fe" strokeWidth="1.5" />
          <rect x="18" y="28" width="52" height="6" fill="#e0e7ff" />
          <rect x="24" y="42" width="14" height="4" rx="2" fill="#818cf8" />
          <rect x="42" y="42" width="8" height="4" rx="2" fill="#c7d2fe" />
          <line x1="38" y1="18" x2="38" y2="58" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="62" cy="50" r="10" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
          <path d="M59 50L61 52L65 48" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // Fallback: kiosk-touch or default
  return (
    <div className={`research-spot-halo health ${compact ? 'compact' : ''}`}>
      <svg width={width} height={height} viewBox="0 0 90 80" fill="none">
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="45" cy="40" r="38" fill={`url(#${gradId})`} />
        <rect x="22" y="16" width="46" height="40" rx="6" fill="#ffffff" stroke="#a7f3d0" strokeWidth="1.5" />
        <rect x="26" y="21" width="38" height="26" rx="3" fill="#f0fdf4" />
        <circle cx="45" cy="51" r="2" fill="#10b981" />
        <circle cx="50" cy="32" r="7" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="50" cy="32" r="3" fill="#10b981" />
      </svg>
    </div>
  );
}

export default function ResearchCard({
  study,
  projects = {},
  isAdmin = false,
  onOpenDetail,
  onEdit,
  onDelete,
  onNavigateToProject
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Initialize bookmark state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bookmark_research_${study.id}`);
      if (saved === 'true') setIsBookmarked(true);
    } catch {
      // ignore
    }
  }, [study.id]);

  // Click outside listener for menu
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleToggleBookmark = (e) => {
    e.stopPropagation();
    const next = !isBookmarked;
    setIsBookmarked(next);
    try {
      localStorage.setItem(`bookmark_research_${study.id}`, String(next));
    } catch {
      // ignore
    }
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(prev => !prev);
  };

  const isHealth = study.domain === 'healthcare';
  const isCompleted = study.status === 'completed' || study.status === 'concluded';
  const isInProgress = study.status === 'in-progress';

  // Domain label
  let domainLabel = isHealth ? 'HEALTHCARE AI' : 'ENTERPRISE INFOSEC';
  if (!isHealth && (study.code?.includes('PQC') || study.tags?.includes('Post-Quantum') || study.title?.toLowerCase().includes('post-quantum'))) {
    domainLabel = 'POST-QUANTUM INFOSEC';
  }

  // Author details fallback
  const authorInfo = study.authorDetails || {
    name: study.author ? study.author.split('(')[0].replace('&.*', '').trim() : 'Research Lead',
    role: study.author && study.author.includes('(') ? study.author.split('(')[1].split(')')[0] : 'Research Specialist',
    avatar: null
  };

  // Target project
  const targetProjectId = study.projectId || study.relatedProjects?.[0];
  const relatedProject = targetProjectId ? projects[targetProjectId] : null;

  // Build deliverable chips
  const deliverableChips = [];
  if (study.deliverables?.pptUrl) {
    deliverableChips.push({
      title: 'SharePoint PPT',
      url: study.deliverables.pptUrl,
      icon: <SharePointIcon size={14} />
    });
  }
  if (study.deliverables?.whitepaperUrl) {
    deliverableChips.push({
      title: 'Whitepaper PDF',
      url: study.deliverables.whitepaperUrl,
      icon: <PdfIcon size={14} />
    });
  }
  if (study.deliverables?.prototypeUrl) {
    deliverableChips.push({
      title: 'GitHub POC',
      url: study.deliverables.prototypeUrl,
      icon: <GitHubIcon size={14} />
    });
  }
  // Fallback to normalized deliverables if none of above exist
  if (deliverableChips.length === 0) {
    const list = normalizeDeliverables(study.deliverables);
    list.slice(0, 3).forEach((deliv) => {
      let icon = <FileText size={14} color="#64748b" />;
      if (deliv.type === 'presentation') icon = <SharePointIcon size={14} />;
      else if (deliv.type === 'code') icon = <GitHubIcon size={14} />;
      else if (deliv.type === 'document') icon = <PdfIcon size={14} />;
      deliverableChips.push({
        title: deliv.title || 'Deliverable',
        url: deliv.url,
        icon
      });
    });
  }

  // Get author initials for fallback
  const initials = authorInfo.name
    ? authorInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'RS';

  return (
    <article
      className={`card research-card-v2 ${isHealth ? 'domain-health' : 'domain-sec'} animate-fade-in`}
      onClick={() => onOpenDetail && onOpenDetail(study.id)}
    >
      <div>
        {/* Top Header: Domain Squircle + Domain Name + Live Dot + Bookmark/Menu Actions */}
        <div className="research-header-v2">
          <div className="domain-tag-group">
            <div className={`domain-squircle ${isHealth ? 'health' : 'sec'}`}>
              {isHealth ? (
                <HeartPulse size={18} strokeWidth={2.5} />
              ) : (
                <Shield size={18} strokeWidth={2.5} />
              )}
            </div>
            <span className={`domain-text-badge ${isHealth ? 'health' : 'sec'}`}>
              <span>{domainLabel}</span>
              <span className={`domain-live-dot ${isHealth ? 'health' : 'sec'}`} />
            </span>
          </div>

          <div className="card-action-icons" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`card-header-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this research note'}
            >
              <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>

            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                type="button"
                className="card-header-action-btn"
                onClick={handleToggleMenu}
                title="More actions"
              >
                <MoreHorizontal size={16} />
              </button>

              {showMenu && (
                <div className="card-menu-dropdown animate-fade-in">
                  <button
                    type="button"
                    className="card-menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      if (onOpenDetail) onOpenDetail(study.id);
                    }}
                  >
                    <Eye size={13} />
                    <span>View Full Brief</span>
                  </button>

                  {relatedProject && (
                    <button
                      type="button"
                      className="card-menu-item"
                      onClick={() => {
                        setShowMenu(false);
                        if (onNavigateToProject) onNavigateToProject(relatedProject.id);
                      }}
                    >
                      <Tag size={13} />
                      <span>Jump to {relatedProject.name}</span>
                    </button>
                  )}

                  {isAdmin && onEdit && (
                    <button
                      type="button"
                      className="card-menu-item"
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(study.id);
                      }}
                    >
                      <Pencil size={13} />
                      <span>Edit Note</span>
                    </button>
                  )}

                  {isAdmin && onDelete && (
                    <button
                      type="button"
                      className="card-menu-item danger"
                      onClick={() => {
                        setShowMenu(false);
                        onDelete(study);
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete Note</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Body: Code Badge + Title on Left, Spot Illustration on Right */}
        <div className="research-top-body">
          <div className="research-top-info">
            <span className={`research-code-pill ${isHealth ? 'health' : 'sec'}`}>
              {study.code}
            </span>
            <h3 className="research-title-v2" title={study.title}>
              {study.title}
            </h3>
          </div>

          <ResearchSpotIllustration
            type={study.illustrationType}
            domain={study.domain}
            uniqueId={study.id}
          />
        </div>

        {/* Abstract / Summary Text */}
        <p className="research-abstract-v2" title={study.context || study.abstract}>
          {study.context || study.abstract}
        </p>
      </div>

      {/* Footer Area: Author & Status + Separator + Deliverables (Pinned to Bottom) */}
      <div className="research-card-lower">
        {/* Caption labels aligned horizontally */}
        <div className="meta-caption-row">
          <span className="meta-caption">AUTHOR</span>
          <span className="meta-caption">STATUS</span>
        </div>

        {/* 2-Column Grid: Author profile on Left, Status Pill on Right */}
        <div className="research-meta-grid">
          <div className="author-profile">
            {authorInfo.avatar ? (
              <img
                src={authorInfo.avatar}
                alt={authorInfo.name}
                className="author-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="author-avatar-fallback"
              style={{ display: authorInfo.avatar ? 'none' : 'flex' }}
            >
              {initials}
            </div>
            <div className="author-text-col">
              <div className="author-name" title={authorInfo.name}>{authorInfo.name}</div>
              <div className="author-role" title={authorInfo.role}>{authorInfo.role}</div>
            </div>
          </div>

          <span
            className={`status-pill-v2 ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'evaluated'}`}
            title={isCompleted ? 'Adopted in Project' : isInProgress ? 'In Progress' : 'Concluded Study'}
          >
            {isCompleted ? (
              <>
                <Check size={11} strokeWidth={3} />
                <span>Adopted</span>
              </>
            ) : isInProgress ? (
              <>
                <span className="status-live-pulse-dot" />
                <span>In Progress</span>
              </>
            ) : (
              <span>Concluded</span>
            )}
          </span>
        </div>

        {/* Divider Line */}
        <div className="research-divider-v2" />

        {/* Deliverables Section */}
        <div className="quick-links-area">
          <span className="meta-caption">DELIVERABLES</span>
          <div className="quick-links-row" onClick={(e) => e.stopPropagation()}>
            {deliverableChips.map((deliv, idx) => (
              <a
                key={idx}
                href={deliv.url}
                target="_blank"
                rel="noreferrer"
                className="quick-link-chip-v2"
                title={`Open ${deliv.title}`}
              >
                {deliv.icon}
                <span>{deliv.title}</span>
                <ExternalLink size={10} color="#94a3b8" />
              </a>
            ))}
            {deliverableChips.length === 0 && (
              <span style={{ fontSize: '0.73rem', color: '#94a3b8', fontStyle: 'italic' }}>
                Full brief available in study view
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
