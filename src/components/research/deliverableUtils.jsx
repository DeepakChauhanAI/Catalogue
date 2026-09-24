import React from 'react';
import {
  Presentation,
  Folder,
  Code2,
  FileText,
  Layout,
  Database,
  Video,
  Link2
} from 'lucide-react';

export const DELIVERABLE_CATEGORIES = [
  { id: 'presentation', label: 'Slide Deck / PPT', icon: Presentation, className: 'ppt', defaultNotes: 'Presentation & executive summary' },
  { id: 'folder', label: 'SharePoint / Drive', icon: Folder, className: 'sp', defaultNotes: 'Working directory & files' },
  { id: 'code', label: 'PoC Sandbox / Repo', icon: Code2, className: 'docs', defaultNotes: 'Prototype codebase & sandbox' },
  { id: 'document', label: 'Spec / ADR / Whitepaper', icon: FileText, className: 'docs', defaultNotes: 'Technical architecture & spec' },
  { id: 'design', label: 'Design / Figma Canvas', icon: Layout, className: 'design', defaultNotes: 'Interactive UI/UX canvas' },
  { id: 'data', label: 'Benchmark / Dataset', icon: Database, className: 'data', defaultNotes: 'Performance metrics & benchmark' },
  { id: 'recording', label: 'Video Walkthrough', icon: Video, className: 'rec', defaultNotes: 'Recorded session & demo' },
  { id: 'link', label: 'External Resource', icon: Link2, className: 'link', defaultNotes: 'External reference link' }
];

export const DELIVERABLE_PRESETS = [
  { title: 'Slide Deck (PPT)', type: 'presentation', notes: 'Internal presentation & executive summary' },
  { title: 'SharePoint Notes Folder', type: 'folder', notes: 'Working notes, logs, and spreadsheets' },
  { title: 'PoC Prototype Sandbox', type: 'code', notes: 'Spike implementation sandbox & repo' },
  { title: 'Architecture ADR / Spec', type: 'document', notes: 'Architecture decision record & spec' },
  { title: 'Figma UI Canvas', type: 'design', notes: 'Interactive design mockup & user flow' },
  { title: 'Benchmark Dataset', type: 'data', notes: 'Evaluation benchmarks & latency metrics' }
];

export function getDeliverableMeta(type) {
  const found = DELIVERABLE_CATEGORIES.find(c => c.id === type);
  if (found) return found;
  return { id: 'link', label: 'Link / Resource', icon: Link2, className: 'link', defaultNotes: 'Resource link' };
}

export function getDeliverableClass(type) {
  return getDeliverableMeta(type).className;
}

export function DeliverableIcon({ type, size = 16, className = '', style = {} }) {
  const meta = getDeliverableMeta(type);
  const IconComponent = meta.icon;
  return <IconComponent size={size} className={className} style={style} />;
}
