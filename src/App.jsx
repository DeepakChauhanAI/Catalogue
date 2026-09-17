import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/common/Navbar';
import LandingPage from './components/landing/LandingPage';
import AuthModal from './components/common/AuthModal';
import DemoView from './components/demo/DemoView';
import AdminView from './components/admin/AdminView';
import DemoVideoModal from './components/demo/DemoVideoModal';
import CompleteFlowModal from './components/demo/CompleteFlowModal';
import ContactDemoModal from './components/demo/ContactDemoModal';
import DetailPane from './components/DetailPane';
import Toast from './components/Toast';
import { getProjects, saveProject, deleteProject } from './data/storageService';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('catalogue_view') || 'landing');
  const [authRole, setAuthRole] = useState(() => localStorage.getItem('catalogue_role') || 'client');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [persona, setPersona] = useState(() => localStorage.getItem('catalogue_persona') || 'demo');
  const [projects, setProjects] = useState(getProjects);
  const [toast, setToast] = useState('');

  // Modal targets: project id | null
  const [videoModal, setVideoModal] = useState(null);
  const [flowModal, setFlowModal] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [returnToAdmin, setReturnToAdmin] = useState(false);

  const searchRef = useRef(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2800);
  }, []);

  useEffect(() => { localStorage.setItem('catalogue_persona', persona); }, [persona]);
  useEffect(() => { localStorage.setItem('catalogue_view', currentView); }, [currentView]);
  useEffect(() => { localStorage.setItem('catalogue_role', authRole); }, [authRole]);

  const handleEnterClient = useCallback(() => {
    setAuthRole('client');
    setPersona('demo');
    setCurrentView('app');
    setDetailId(null);
    showToast('Entered Client Demo Showcase');
  }, [showToast]);

  const handleEnterAdmin = useCallback(() => {
    if (authRole === 'admin') {
      setPersona('admin');
      setCurrentView('app');
      setDetailId(null);
      showToast('Entered Portfolio Admin Console');
    } else {
      setAuthModalOpen(true);
    }
  }, [authRole, showToast]);

  const handleAdminAuthSuccess = useCallback((userProfile) => {
    setAuthRole('admin');
    setPersona('admin');
    setCurrentView('app');
    setAuthModalOpen(false);
    setDetailId(null);
    showToast('Authenticated as Portfolio Administrator');
  }, [showToast]);

  const handleGoToLanding = useCallback(() => {
    setCurrentView('landing');
    setDetailId(null);
    setVideoModal(null);
    setFlowModal(null);
    setContactModal(null);
    setReturnToAdmin(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setAuthRole('client');
    setPersona('demo');
    setCurrentView('landing');
    setDetailId(null);
    setVideoModal(null);
    setFlowModal(null);
    setContactModal(null);
    setReturnToAdmin(false);
    showToast('Signed out. Returned to Gateway.');
  }, [showToast]);

  const handleBackFromDetail = useCallback(() => {
    setDetailId(null);
    if (returnToAdmin && authRole === 'admin') {
      setPersona('admin');
      setReturnToAdmin(false);
      showToast('Returned to Admin Workspace');
    }
  }, [returnToAdmin, authRole, showToast]);

  const switchPersona = useCallback(() => {
    setVideoModal(null); setFlowModal(null); setContactModal(null); setDetailId(null);
    setReturnToAdmin(false);

    if (authRole !== 'admin') {
      return;
    }

    setPersona(p => {
      const next = p === 'demo' ? 'admin' : 'demo';
      showToast(next === 'admin' ? 'Switched to Admin Console' : 'Switched to Client View Preview');
      return next;
    });
  }, [authRole, showToast]);

  const handleSaveProject = useCallback((project, isNew = false) => {
    saveProject(project);
    setProjects(getProjects());
    showToast(isNew ? `Project "${project.name}" created successfully` : 'Changes saved — client view updated');
  }, [showToast]);

  const handleDeleteProject = useCallback((id, name) => {
    deleteProject(id);
    setProjects(getProjects());
    showToast(name ? `Project "${name}" deleted` : 'Project deleted');
  }, [showToast]);

  const closeTop = useCallback(() => {
    if (authModalOpen) { setAuthModalOpen(false); return true; }
    if (videoModal) { setVideoModal(null); return true; }
    if (flowModal) { setFlowModal(null); return true; }
    if (contactModal) { setContactModal(null); return true; }
    if (detailId) {
      handleBackFromDetail();
      return true;
    }
    return false;
  }, [authModalOpen, videoModal, flowModal, contactModal, detailId, handleBackFromDetail]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }
      if (e.key === 'Escape') {
        if (document.activeElement === searchRef.current) { searchRef.current.blur(); return; }
        if (persona === 'demo') {
          closeTop();
        }
        return;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeTop, persona]);

  const videoProject = videoModal ? projects[videoModal] : null;
  const flowProject = flowModal ? projects[flowModal] : null;
  const contactProject = contactModal ? projects[contactModal] : null;
  const detailProject = detailId ? projects[detailId] : null;

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage
          onEnterClient={handleEnterClient}
          onEnterAdmin={handleEnterAdmin}
        />
      ) : (
        <>
          <Navbar
            persona={persona}
            authRole={authRole}
            onGoToLanding={handleGoToLanding}
            onSignOut={handleSignOut}
          />
          {persona === 'admin' && authRole === 'admin' ? (
            <AdminView
              projects={projects}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onPreviewProject={(id) => {
                setReturnToAdmin(true);
                setPersona('demo');
                setDetailId(id);
              }}
            />
          ) : detailProject ? (
            <DetailPane
              product={detailProject}
              onBack={handleBackFromDetail}
              onOpenVideo={setVideoModal}
              onOpenFlow={setFlowModal}
              onOpenContact={setContactModal}
              isPreviewFromAdmin={returnToAdmin && authRole === 'admin'}
            />
          ) : (
            <DemoView
              products={Object.values(projects)}
              searchRef={searchRef}
              onOpenDetail={setDetailId}
              onOpenVideo={setVideoModal}
              onOpenFlow={setFlowModal}
              onOpenContact={setContactModal}
            />
          )}
        </>
      )}

      {/* Shared Modals */}
      {videoProject && (
        <DemoVideoModal project={videoProject} onClose={() => setVideoModal(null)} />
      )}
      {flowProject && (
        <CompleteFlowModal project={flowProject} onClose={() => setFlowModal(null)} />
      )}
      {contactProject && (
        <ContactDemoModal
          project={contactProject}
          onClose={() => setContactModal(null)}
          onSubmitted={showToast}
        />
      )}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />
      <Toast message={toast} />
    </>
  );
}
