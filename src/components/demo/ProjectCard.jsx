import React from 'react';
import {
  Play, Sparkles, Calendar, Tag, Clock, CalendarClock, ChevronRight,
  Activity, ShieldCheck, Pencil, Eye, Trash2
} from 'lucide-react';

// Unified card supporting both responsive Grid view and horizontal List view,
// across both Demo (client showcase) and Admin (operations portal) personas.
export default function ProjectCard({
  product,
  viewMode = 'grid',
  isAdmin = false,
  onOpenDetail,
  onOpenVideo,
  onOpenFlow,
  onOpenContact,
  onEdit,
  onPreview,
  onDelete
}) {
  const { demoFlow } = product;
  const isHealth = product.domain === 'healthcare';
  const isGrid = viewMode === 'grid';
  const thumbnailUrl = product.thumbnailUrl || demoFlow.demoVideo?.thumbnailUrl;

  const bannerStyle = thumbnailUrl ? {
    backgroundImage: isHealth
      ? `linear-gradient(to top, rgba(6, 78, 59, 0.94) 0%, rgba(6, 78, 59, 0.42) 48%, rgba(6, 78, 59, 0.12) 100%), url(${thumbnailUrl})`
      : `linear-gradient(to top, rgba(30, 27, 75, 0.95) 0%, rgba(49, 46, 129, 0.45) 48%, rgba(30, 27, 75, 0.12) 100%), url(${thumbnailUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : undefined;

  const handleBannerClick = () => {
    if (isAdmin && onPreview) {
      onPreview(product.id);
    } else if (onOpenDetail) {
      onOpenDetail(product.id);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button, a, input, textarea, select')) {
      return;
    }
    handleBannerClick();
  };

  return (
    <article
      className={`project-card ${isGrid ? 'is-grid' : 'is-list'} ${isHealth ? 'domain-health' : 'domain-sec'} animate-fade-in`}
      onClick={handleCardClick}
    >
      {/* Media Preview Banner */}
      <div
        className={`card-banner ${isHealth ? 'banner-health' : 'banner-sec'}`}
        style={bannerStyle}
        role="button"
        tabIndex={0}
        onClick={handleBannerClick}
        onKeyDown={(e) => e.key === 'Enter' && handleBannerClick()}
        aria-label={isAdmin ? `Preview ${product.name} in Demo Mode` : `Open ${product.name} details`}
      >
        <div className="banner-top-bar">
          <span className={`domain-chip ${isHealth ? 'health' : 'sec'}`}>
            {isHealth ? <Activity size={12} /> : <ShieldCheck size={12} />}
            <span>{isHealth ? 'HealthCare AI' : 'InfoSec'}</span>
          </span>

          {/* Admin Persona: Safe Read-Only Active Mode Status Badges */}
          {isAdmin ? (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', pointerEvents: 'none' }}>
              {demoFlow.completeFlow?.enabled && (
                <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  <Sparkles size={10} /> Flow
                </span>
              )}
              {demoFlow.demoVideo?.enabled && (
                <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  <Play size={10} /> Video
                </span>
              )}
              {demoFlow.contactDemo?.enabled && (
                <span className="badge badge-brand" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                  <Calendar size={10} /> Contact
                </span>
              )}
            </div>
          ) : (
            /* Demo Persona: Live Sandbox Ready Beacon */
            <span className="banner-status-badge">
              <span className="pulse-beacon" style={{ width: 6, height: 6 }} />
              <span>{demoFlow.completeFlow?.enabled ? 'Live Sandbox' : 'Verified'}</span>
            </span>
          )}
        </div>

        {demoFlow.demoVideo?.enabled && onOpenVideo && !isAdmin && (
          <span
            className="banner-play"
            role="button"
            tabIndex={0}
            onClick={(e) => { e.stopPropagation(); onOpenVideo(product.id); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onOpenVideo(product.id); } }}
            aria-label={`Watch ${product.name} demo video`}
            title="Watch demo video"
          >
            <Play size={22} fill="currentColor" />
          </span>
        )}
        <div className="banner-title">{product.name}</div>
      </div>

      {/* Info Body */}
      <div className="card-body">
        {isGrid ? (
          <>
            <div>
              <button
                type="button"
                className="grid-card-title"
                onClick={handleBannerClick}
                title={isAdmin ? "Preview project in Demo Mode" : "View full project details"}
              >
                <span>{product.name}</span>
                <ChevronRight size={16} className="title-arrow" />
              </button>
              <p className="grid-card-tagline">
                {product.tagline}
              </p>
            </div>

            <div className="grid-meta-chips">
              <span className="grid-chip"><Tag size={12} /> {product.category}</span>
              <span className="grid-chip"><Clock size={12} /> {demoFlow.demoVideo?.videoDuration || 'Demo'}</span>
              <span className="grid-chip"><CalendarClock size={12} /> {product.lastUpdated}</span>
            </div>

            {/* Action Bar: Admin vs Demo */}
            {isAdmin ? (
              <div className="admin-card-actions">
                <button
                  type="button"
                  className="grid-action-btn primary"
                  onClick={(e) => { e.stopPropagation(); onEdit && onEdit(product.id); }}
                  title="Edit project configuration and details"
                >
                  <Pencil size={13} />
                  <span>Edit Project</span>
                </button>
                {onPreview && (
                  <button
                    type="button"
                    className="grid-action-btn"
                    onClick={(e) => { e.stopPropagation(); onPreview(product.id); }}
                    title="Preview how this project looks to users in Demo Mode"
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="grid-action-btn danger"
                    onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                    title={`Delete ${product.name}`}
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ) : (
              <div className="demo-grid-actions">
                {demoFlow.completeFlow?.enabled && (
                  <button
                    type="button"
                    className="grid-action-btn primary"
                    onClick={(e) => { e.stopPropagation(); onOpenFlow(product.id); }}
                  >
                    <Sparkles size={14} />
                    <span>Complete Flow Demo</span>
                  </button>
                )}
                {demoFlow.demoVideo?.enabled && (
                  <button
                    type="button"
                    className="grid-action-btn"
                    onClick={(e) => { e.stopPropagation(); onOpenVideo(product.id); }}
                  >
                    <Play size={14} />
                    <span>Watch Demo ({demoFlow.demoVideo.videoDuration})</span>
                  </button>
                )}
                {demoFlow.contactDemo?.enabled && (
                  <button
                    type="button"
                    className="grid-action-btn"
                    onClick={(e) => { e.stopPropagation(); onOpenContact(product.id); }}
                  >
                    <Calendar size={14} />
                    <span>Schedule Demo</span>
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <h3
                className="t-lg"
                style={{ fontWeight: 800, cursor: 'pointer' }}
                onClick={handleBannerClick}
                title={isAdmin ? "Preview project in Demo Mode" : "View full project details"}
              >
                {product.name}
              </h3>
              <p className="t-sm" style={{ color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.55 }}>
                {product.tagline}
              </p>
            </div>

            <div className="meta-rows">
              <span className="meta-row"><Tag size={13} /> <strong>Category:</strong> {product.category}</span>
              <span className="meta-row"><Clock size={13} /> <strong>Duration:</strong> {demoFlow.demoVideo?.videoDuration || 'Demo'}</span>
              <span className="meta-row"><CalendarClock size={13} /> <strong>Last Updated:</strong> {product.lastUpdated}</span>
            </div>

            {/* List View Actions: Admin vs Demo */}
            {isAdmin ? (
              <div className="demo-tiles">
                <button
                  type="button"
                  className="demo-tile"
                  onClick={(e) => { e.stopPropagation(); onEdit && onEdit(product.id); }}
                  style={{ borderLeft: '3px solid var(--primary)' }}
                >
                  <span className="tile-icon" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)' }}><Pencil size={16} /></span>
                  <span>
                    <span className="tile-title">Edit Configuration</span><br />
                    <span className="tile-sub">Modify project details, demo modes, and media</span>
                  </span>
                </button>
                {onPreview && (
                  <button
                    type="button"
                    className="demo-tile"
                    onClick={(e) => { e.stopPropagation(); onPreview(product.id); }}
                  >
                    <span className="tile-icon"><Eye size={16} /></span>
                    <span>
                      <span className="tile-title">Client Demo Preview</span><br />
                      <span className="tile-sub">Inspect client showcase detail view</span>
                    </span>
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="demo-tile"
                    onClick={(e) => { e.stopPropagation(); onDelete(product); }}
                    style={{ borderLeft: '3px solid var(--color-rose)' }}
                  >
                    <span className="tile-icon" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-rose)' }}><Trash2 size={16} /></span>
                    <span>
                      <span className="tile-title" style={{ color: 'var(--color-rose)' }}>Delete Project</span><br />
                      <span className="tile-sub">Remove from portfolio</span>
                    </span>
                  </button>
                )}
              </div>
            ) : (
              <div className="demo-tiles">
                {demoFlow.completeFlow?.enabled && (
                  <button type="button" className="demo-tile" onClick={() => onOpenFlow(product.id)}>
                    <span className="tile-icon"><Sparkles size={16} /></span>
                    <span>
                      <span className="tile-title">Complete Flow Demo</span><br />
                      <span className="tile-sub">Experience the interactive demo</span>
                    </span>
                  </button>
                )}
                {demoFlow.demoVideo?.enabled && (
                  <button type="button" className="demo-tile" onClick={() => onOpenVideo(product.id)}>
                    <span className="tile-icon"><Play size={16} /></span>
                    <span>
                      <span className="tile-title">Watch Demo Video ({demoFlow.demoVideo.videoDuration})</span><br />
                      <span className="tile-sub">See the product in action</span>
                    </span>
                  </button>
                )}
                {demoFlow.contactDemo?.enabled && (
                  <button type="button" className="demo-tile" onClick={() => onOpenContact(product.id)}>
                    <span className="tile-icon"><Calendar size={16} /></span>
                    <span>
                      <span className="tile-title">Schedule Demo</span><br />
                      <span className="tile-sub">Request a live consultation</span>
                    </span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
