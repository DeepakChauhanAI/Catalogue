import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Navbar from './components/common/Navbar';
import LandingPage from './components/landing/LandingPage';
import AuthModal from './components/common/AuthModal';
import DemoView from './components/demo/DemoView';
import ResearchView from './components/research/ResearchView';
import AdminView from './components/admin/AdminView';
import DemoVideoModal from './components/demo/DemoVideoModal';
import CompleteFlowModal from './components/demo/CompleteFlowModal';
import ContactDemoModal from './components/demo/ContactDemoModal';
import DetailPane from './components/DetailPane';
import Toast from './components/Toast';
import {
  getProjects, saveProject, deleteProject,
  getResearches, saveResearch, deleteResearch
} from './data/storageService';

export default function App() {
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('catalogue_view') || 'landing');
  const [authRole, setAuthRole] = useState(() => localStorage.getItem('catalogue_role') || 'client');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [persona, setPersona] = useState(() => localStorage.getItem('catalogue_persona') || 'demo');
  const [activeHub, setActiveHub] = useState(() => localStorage.getItem('catalogue_active_hub') || 'projects');

  const [projects, setProjects] = useState(getProjects);
  const [researches, setResearches] = useState(getResearches);
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
  useEffect(() => { localStorage.setItem('catalogue_active_hub', activeHub); }, [activeHub]);

  // Ensure window scroll resets to top when opening an overview page
  useEffect(() => {
    if (detailId) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, [detailId]);

  const handleEnterClient = useCallback(() => {
    setAuthRole('client');
    setPersona('demo');
    setCurrentView('app');
    setDetailId(null);
    showToast('Entered Enterprise Hub');
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

  const handleAdminAuthSuccess = useCallback(() => {
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

  const savedScrollPosRef = useRef(0);

  const handleOpenDetail = useCallback((id, isPreview = false) => {
    savedScrollPosRef.current = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
    if (isPreview) {
      setReturnToAdmin(true);
      setPersona('demo');
      setActiveHub('projects');
    }
    setDetailId(id);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    const targetScrollY = savedScrollPosRef.current;
    setDetailId(null);
    if (returnToAdmin && authRole === 'admin') {
      setPersona('admin');
      setReturnToAdmin(false);
      showToast('Returned to Admin Workspace');
    }
    // Restore the exact scroll position on the main screen where user clicked the card
    requestAnimationFrame(() => {
      window.scrollTo({ top: targetScrollY, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = targetScrollY;
      if (document.body) document.body.scrollTop = targetScrollY;
      setTimeout(() => {
        window.scrollTo({ top: targetScrollY, left: 0, behavior: 'instant' });
        if (document.documentElement) document.documentElement.scrollTop = targetScrollY;
        if (document.body) document.body.scrollTop = targetScrollY;
      }, 30);
    });
  }, [returnToAdmin, authRole, showToast]);

  const handleSaveProject = useCallback((project, isNew = false) => {
    saveProject(project);
    setProjects(getProjects());
    showToast(isNew ? `Project "${project.name}" created successfully` : 'Changes saved successfully');
  }, [showToast]);

  const handleDeleteProject = useCallback((id, name) => {
    deleteProject(id);
    setProjects(getProjects());
    showToast(name ? `Project "${name}" deleted` : 'Project deleted');
  }, [showToast]);

  const handleSaveResearch = useCallback((study, isNew = false) => {
    saveResearch(study);
    setResearches(getResearches());
    showToast(isNew ? `Research study "${study.code}" published` : `Changes saved to "${study.code}"`);
  }, [showToast]);

  const handleDeleteResearch = useCallback((id) => {
    deleteResearch(id);
    setResearches(getResearches());
    showToast('Research study deleted');
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

  const activeProjects = useMemo(
    () => Object.values(projects).filter(p => (p.lifecycle?.status || 'active') === 'active'),
    [projects]
  );

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
            activeHub={activeHub}
            onSwitchHub={(hub) => {
              if (authRole === 'admin') {
                setActiveHub(hub);
              } else {
                setActiveHub('projects');
              }
              setDetailId(null);
            }}
            projectCount={authRole === 'admin' ? Object.keys(projects).length : activeProjects.length}
            researchCount={Object.keys(researches).length}
            onGoToLanding={handleGoToLanding}
            onSignOut={handleSignOut}
          />
          {persona === 'admin' && authRole === 'admin' ? (
            <AdminView
              projects={projects}
              researches={researches}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onPreviewProject={(id) => handleOpenDetail(id, true)}
              onSaveResearch={handleSaveResearch}
              onDeleteResearch={handleDeleteResearch}
            />
          ) : detailProject ? (
            <DetailPane
              product={detailProject}
              researches={researches}
              onBack={handleBackFromDetail}
              onOpenVideo={setVideoModal}
              onOpenFlow={setFlowModal}
              onOpenContact={setContactModal}
              isPreviewFromAdmin={returnToAdmin && authRole === 'admin'}
              onNavigateToResearch={(resId) => {
                if (authRole === 'admin') {
                  setActiveHub('research');
                  setDetailId(null);
                }
              }}
            />
          ) : (authRole === 'admin' && activeHub === 'research') ? (
            <ResearchView
              researches={researches}
              projects={projects}
              isAdmin={true}
              searchRef={searchRef}
              onOpenProjectDetail={(id) => handleOpenDetail(id, false)}
              onNavigateToProjectsHub={() => setActiveHub('projects')}
            />
          ) : (
            <DemoView
              products={activeProjects}
              searchRef={searchRef}
              onOpenDetail={(id) => handleOpenDetail(id, false)}
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
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={handleAdminAuthSuccess}
        />
      )}
      <Toast message={toast} />
    </>
  );
}
