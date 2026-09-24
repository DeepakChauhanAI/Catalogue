import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  HeartPulse,
  Shield,
  Check,
  Eye,
  Pencil,
  Trash2,
  ExternalLink,
  ArrowRight,
  Tag
} from 'lucide-react';
import { normalizeDeliverables } from '../../data/catalogData';
import {
  SharePointIcon,
  PdfIcon,
  GitHubIcon,
  ResearchSpotIllustration
} from './ResearchCard';

export default function ResearchListRow({
  study,
  projects = {},
  isAdmin = false,
  onOpenDetail,
  onEdit,
  onDelete,
  onNavigateToProject
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`bookmark_research_${study.id}`);
      if (saved === 'true') setIsBookmarked(true);
    } catch {
      // ignore
    }
  }, [study.id]);

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
      icon: <SharePointIcon size={13} />
    });
  }
  if (study.deliverables?.whitepaperUrl) {
    deliverableChips.push({
      title: 'Whitepaper PDF',
      url: study.deliverables.whitepaperUrl,
      icon: <PdfIcon size={13} />
    });
  }
  if (study.deliverables?.prototypeUrl) {
    deliverableChips.push({
      title: 'GitHub POC',
      url: study.deliverables.prototypeUrl,
      icon: <GitHubIcon size={13} />
    });
  }
  if (deliverableChips.length === 0) {
    const list = normalizeDeliverables(study.deliverables);
    list.slice(0, 3).forEach((deliv) => {
      let icon = <PdfIcon size={13} />;
      if (deliv.type === 'presentation') icon = <SharePointIcon size={13} />;
      else if (deliv.type === 'code') icon = <GitHubIcon size={13} />;
      deliverableChips.push({
        title: deliv.title || 'Deliverable',
        url: deliv.url,
        icon
      });
    });
  }

  // Author initials for fallback
  const initials = authorInfo.name
    ? authorInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'RS';

  return (
    <div
      className={`research-list-row-v2 ${isHealth ? 'domain-health' : 'domain-sec'} animate-fade-in`}
      onClick={() => onOpenDetail && onOpenDetail(study.id)}
    >
      {/* Top Header Row in List Card: Squircle + Domain + Code + Status + Actions */}
      <div className="research-list-v2-header">
        <div className="research-list-v2-header-left">
          <div className={`domain-squircle ${isHealth ? 'health' : 'sec'}`} style={{ width: 30, height: 30, borderRadius: 8 }}>
            {isHealth ? (
              <HeartPulse size={15} strokeWidth={2.5} />
            ) : (
              <Shield size={15} strokeWidth={2.5} />
            )}
          </div>
          <span className={`domain-text-badge ${isHealth ? 'health' : 'sec'}`} style={{ fontSize: '0.68rem' }}>
            <span>{domainLabel}</span>
            <span className={`domain-live-dot ${isHealth ? 'health' : 'sec'}`} />
          </span>
          <span className={`research-code-pill ${isHealth ? 'health' : 'sec'}`} style={{ marginBottom: 0, padding: '0.12rem 0.5rem', fontSize: '0.68rem' }}>
            {study.code}
          </span>
        </div>

        <div className="research-list-v2-header-right" onClick={(e) => e.stopPropagation()}>
          <span className={`status-pill-v2 ${isCompleted ? 'completed' : isInProgress ? 'in-progress' : 'evaluated'}`} style={{ padding: '0.22rem 0.65rem', fontSize: '0.71rem' }}>
            {isCompleted ? (
              <>
                <Check size={11} strokeWidth={3} />
                <span>Adopted in Project</span>
              </>
            ) : isInProgress ? (
              <>
                <span className="status-live-pulse-dot" />
                <span>Active Spike</span>
              </>
            ) : (
              <span>Explored / Inactive</span>
            )}
          </span>

          <button
            type="button"
            className={`card-header-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleToggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this research note'}
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            type="button"
            className="card-header-action-btn"
            onClick={() => onOpenDetail && onOpenDetail(study.id)}
            title="Preview full brief"
          >
            <Eye size={15} />
          </button>

          {isAdmin && onEdit && (
            <button
              type="button"
              className="card-header-action-btn"
              onClick={() => onEdit(study.id)}
              title="Edit research note"
            >
              <Pencil size={14} color="#4f46e5" />
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              type="button"
              className="card-header-action-btn"
              onClick={() => onDelete(study)}
              title="Delete research note"
            >
              <Trash2 size={14} color="#ef4444" />
            </button>
          )}
        </div>
      </div>

      {/* Middle Row: Title & Abstract on Left, Compact Spot Illustration on Right */}
      <div className="research-list-v2-body">
        <div className="research-list-v2-text">
          <h4 className="research-list-v2-title">
            {study.title}
          </h4>
          <p className="research-list-v2-abstract">
            {study.context || study.abstract}
          </p>
        </div>

        <div className="research-list-v2-spot">
          <ResearchSpotIllustration
            type={study.illustrationType}
            domain={study.domain}
            uniqueId={study.id}
            compact={true}
          />
        </div>
      </div>

      {/* Footer Row: Author + Project Jump Button + Deliverables Quick Links */}
      <div className="research-list-v2-footer">
        {/* Author info */}
        <div className="author-profile" style={{ gap: '0.45rem' }}>
          {authorInfo.avatar ? (
            <img
              src={authorInfo.avatar}
              alt={authorInfo.name}
              className="author-avatar"
              style={{ width: 28, height: 28 }}
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="author-avatar-fallback"
            style={{ width: 28, height: 28, fontSize: '0.68rem', display: authorInfo.avatar ? 'none' : 'flex' }}
          >
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              {authorInfo.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#64748b', lineHeight: 1.1 }}>
              {authorInfo.role}
            </span>
          </div>
        </div>

        {/* Deliverables & Project Link */}
        <div className="research-list-v2-links" onClick={(e) => e.stopPropagation()}>
          {relatedProject && (
            <button
              type="button"
              className="related-project-chip"
              onClick={() => onNavigateToProject && onNavigateToProject(relatedProject.id)}
              title={`Open ${relatedProject.name} workspace`}
              style={{ padding: '0.25rem 0.6rem', fontSize: '0.71rem' }}
            >
              <span>Solution: <strong>{relatedProject.name}</strong></span>
              <ArrowRight size={11} />
            </button>
          )}

          {deliverableChips.map((deliv, idx) => (
            <a
              key={idx}
              href={deliv.url}
              target="_blank"
              rel="noreferrer"
              className="quick-link-chip-v2"
              title={`Open ${deliv.title}`}
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.71rem' }}
            >
              {deliv.icon}
              <span>{deliv.title}</span>
              <ExternalLink size={10} color="#94a3b8" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
