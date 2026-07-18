import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import EventOverview from './components/EventDetails';
import SubmissionPortal from './components/SubmissionPortal';
import Features from './components/Features';
import RoundOnePage from './components/RoundOnePage';
import './App.css';

function HomePage() {
  const shellRef = useRef(null);

  useEffect(() => {
    const shell = shellRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!shell || reduceMotion.matches) {
      return undefined;
    }

    const layers = Array.from(shell.querySelectorAll('[data-parallax]'));
    let frameId = null;

    const renderParallax = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollY = Math.max(window.scrollY, 0);
      const heroProgress = Math.min(scrollY / (viewportHeight * 0.78), 1);
      const actionSplay = heroProgress * 18;

      shell.style.setProperty('--hero-drift', (heroProgress * 42).toFixed(2) + 'px');
      shell.style.setProperty('--hero-logo-drift', (heroProgress * 16).toFixed(2) + 'px');
      shell.style.setProperty('--action-splay-left', (-actionSplay).toFixed(2) + 'px');
      shell.style.setProperty('--action-splay-right', actionSplay.toFixed(2) + 'px');
      shell.style.setProperty('--scroll-glow', (14 + heroProgress * 14).toFixed(2) + 'px');

      layers.forEach((layer) => {
        const depth = Number.parseFloat(layer.dataset.parallax || '0');
        const bounds = layer.getBoundingClientRect();
        const centerDelta = (bounds.top + bounds.height / 2 - viewportHeight / 2) / viewportHeight;
        const normalized = Math.max(-1, Math.min(1, centerDelta));
        const offset = -normalized * depth * 180;

        layer.style.setProperty('--section-parallax', offset.toFixed(2) + 'px');
      });

      frameId = null;
    };

    const scheduleParallax = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(renderParallax);
      }
    };

    shell.classList.add('parallax-enabled');
    renderParallax();
    window.addEventListener('scroll', scheduleParallax, { passive: true });
    window.addEventListener('resize', scheduleParallax);

    return () => {
      window.removeEventListener('scroll', scheduleParallax);
      window.removeEventListener('resize', scheduleParallax);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      shell.classList.remove('parallax-enabled');
      layers.forEach((layer) => layer.style.removeProperty('--section-parallax'));
    };
  }, []);

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="background-stage" aria-hidden="true">
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          onCanPlay={(event) => event.currentTarget.classList.add('is-ready')}
        >
          <source src="/ideathon-background.mp4" type="video/mp4" />
        </video>
        <div className="background-colorwash" />
        <div className="background-vignette" />
      </div>

      <div className="page-frame">
        <Header />
        <main>
          <Hero />
          <EventOverview />
          <SubmissionPortal />
          <Features />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/round-one" element={<RoundOnePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
