import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { CertPage } from './pages/CertPage';
import { DomainPage } from './pages/DomainPage';
import { ConceptPage } from './pages/ConceptPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizPage } from './pages/QuizPage';
import { StatementsPage } from './pages/StatementsPage';
import { DiagramsPage } from './pages/DiagramsPage';
import { ProgressPage } from './pages/ProgressPage';
import { ConceptsPage } from './pages/ConceptsPage';
import { OutcomesPage } from './pages/OutcomesPage';
import { loadProgress, updateProgress } from './lib/progress';

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark' | undefined>(() => loadProgress().theme);
  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
  }, [theme]);
  const toggle = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const current = theme ?? (prefersDark ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    updateProgress((p) => ({ ...p, theme: next }));
  };
  return { theme, toggle };
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  const { toggle } = useTheme();
  return (
    <div className="shell">
      <ScrollToTop />
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">✦</span>
            <span>Copilot Cert Academy</span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <NavLink to="/outcomes">Outcomes</NavLink>
            <NavLink to="/concepts">Concepts</NavLink>
            <NavLink to="/flashcards">Flashcards</NavLink>
            <NavLink to="/quiz">Quiz</NavLink>
            <NavLink to="/statements">Statements</NavLink>
            <NavLink to="/diagrams">Diagrams</NavLink>
            <NavLink to="/progress">Progress</NavLink>
          </nav>
          <button className="theme-btn" onClick={toggle} aria-label="Toggle color theme" title="Toggle theme">
            ◐
          </button>
        </div>
      </header>
      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/cert/:certId" element={<CertPage />} />
          <Route path="/outcomes" element={<OutcomesPage />} />
          <Route path="/cert/:certId/outcomes" element={<OutcomesPage />} />
          <Route path="/cert/:certId/domain/:domainId" element={<DomainPage />} />
          <Route path="/cert/:certId/concept/:conceptId" element={<ConceptPage />} />
          <Route path="/concept/:conceptId" element={<ConceptPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/statements" element={<StatementsPage />} />
          <Route path="/diagrams" element={<DiagramsPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <footer className="footer">
        Community study material. Not affiliated with or endorsed by Microsoft or GitHub. Skills measured are transcribed from the
        official study guides on{' '}
        <a href="https://learn.microsoft.com/credentials/" target="_blank" rel="noreferrer">
          Microsoft Learn
        </a>
        . Progress is stored only in your browser.
      </footer>
    </div>
  );
}
