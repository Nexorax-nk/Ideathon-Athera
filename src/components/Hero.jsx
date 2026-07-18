import { ArrowDownRight, Compass, FilePenLine } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => (
  <section className="hero" id="top">
    <div className="hero-content" data-parallax="0.12">
      <h1 className="sr-only">Ideathon - Flagship Innovation Challenge</h1>
      <img
        className="hero-logo-img"
        src="/ideathon-wordmark-v2.png"
        alt="Ideathon - Flagship Innovation Challenge"
      />

      <p className="hero-tagline">ONE IDEA. ENDLESS POSSIBILITIES. REAL IMPACT.</p>

      <div className="hero-actions" aria-label="Quick actions">
        <Link className="hero-action-card hero-action-button hero-action-card-primary" to="/round-one">
          <span className="hero-action-scan" aria-hidden="true" />
          <span className="hero-action-rail" aria-hidden="true"><i /><i /><i /></span>
          <span className="hero-action-icon" aria-hidden="true">
            <FilePenLine size={25} strokeWidth={1.45} />
          </span>
          <span className="hero-action-copy">
            <small>REGISTRATION OPEN</small>
            <strong>REGISTER &amp; START ROUND 1</strong>
          </span>
          <span className="hero-action-arrow" aria-hidden="true">
            <ArrowDownRight size={18} strokeWidth={1.8} />
          </span>
        </Link>

        <a className="hero-action-card hero-action-button hero-action-card-secondary" href="#event-details">
          <span className="hero-action-scan" aria-hidden="true" />
          <span className="hero-action-rail" aria-hidden="true"><i /><i /><i /></span>
          <span className="hero-action-icon" aria-hidden="true">
            <Compass size={25} strokeWidth={1.45} />
          </span>
          <span className="hero-action-copy">
            <small>EVENT BRIEF</small>
            <strong>EXPLORE EVENT DETAILS</strong>
          </span>
          <span className="hero-action-arrow" aria-hidden="true">
            <ArrowDownRight size={18} strokeWidth={1.8} />
          </span>
        </a>
      </div>

      <div className="hero-spectrum" aria-label="Ideathon journey">
        <span>IDENTIFY</span><i />
        <span>INNOVATE</span><i />
        <span>PRESENT</span><i />
        <span>CREATE IMPACT</span>
      </div>
    </div>
  </section>
);

export default Hero;
