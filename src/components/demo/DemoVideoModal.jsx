import React, { useRef } from 'react';
import { X, Play } from 'lucide-react';

const toSeconds = (ts) => {
  const [m, s] = ts.split(':').map(Number);
  return m * 60 + s;
};

export default function DemoVideoModal({ project, onClose }) {
  const { demoVideo } = project.demoFlow;
  const videoRef = useRef(null);

  const seek = (ts) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = toSeconds(ts);
    video.play();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={`${project.name} demo video`}>
      <div className="modal" style={{ maxWidth: 860 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="t-lg" style={{ fontWeight: 800 }}>{project.name} — Demo Video</h3>
            <p className="t-xs" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              {demoVideo.videoDuration} · {demoVideo.chapters.length} chapters
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <video
            ref={videoRef}
            src={demoVideo.videoUrl}
            poster={demoVideo.thumbnailUrl || undefined}
            controls
            preload="metadata"
            style={{ width: '100%', borderRadius: 'var(--radius-sm)', background: '#000', aspectRatio: '16 / 9' }}
          />
          <div className="t-label" style={{ margin: '1.1rem 0 0.5rem' }}>Chapters</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {demoVideo.chapters.map((c, i) => (
              <button
                key={i}
                onClick={() => seek(c.timestamp)}
                className="admin-project-row"
                style={{ padding: '0.65rem 0.9rem', textAlign: 'left' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
                  <span className="font-mono t-xs" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-xs)', fontWeight: 700 }}>
                    {c.timestamp}
                  </span>
                  <span>
                    <span className="t-sm" style={{ fontWeight: 700, display: 'block' }}>{c.title}</span>
                    <span className="t-xs" style={{ color: 'var(--text-muted)' }}>{c.description}</span>
                  </span>
                </span>
                <Play size={14} color="var(--text-faint)" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
