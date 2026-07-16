import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Header.css';

const Header = () => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const frameId = useRef(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateVisibility = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastScrollY.current;

      if (currentY <= 12) {
        setIsHidden(false);
      } else if (delta > 2) {
        setIsHidden(true);
      } else if (delta < -2) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
      frameId.current = null;
    };

    const handleScroll = () => {
      if (frameId.current === null) {
        frameId.current = window.requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameId.current !== null) {
        window.cancelAnimationFrame(frameId.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const appShell = document.querySelector('.app-shell');
    appShell?.classList.toggle('nav-hidden', isHidden);

    return () => appShell?.classList.remove('nav-hidden');
  }, [isHidden]);

  return (
    <header
      className={'site-header' + (isHidden ? ' is-hidden' : '')}
      onFocusCapture={() => setIsHidden(false)}
    >
      <a className="brand" href="#top" aria-label="Ideathon home">
        <img className="brand-logo" src="/ideathon-wordmark-v2.png" alt="Ideathon" />
      </a>

      <nav className="header-actions" aria-label="Primary navigation">
        <a className="header-link" href="#event-details">EVENT INFO</a>
        <a className="header-cta" href="#submission-portal">
          <span>ENTER PORTAL</span>
          <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
        </a>
      </nav>
    </header>
  );
};

export default Header;
