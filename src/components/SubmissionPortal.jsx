import { ArrowRight, Lightbulb, LockKeyhole } from 'lucide-react';
import './SubmissionPortal.css';

const SubmissionPortal = () => (
  <section className="submission-portal" id="submission-portal" aria-labelledby="portal-title" data-parallax="0.055">
    <div className="portal-heading">
      <span />
      <h2 id="portal-title">SUBMISSION PORTAL</h2>
      <span />
    </div>

    <div className="portal-grid">
      <article className="round-card round-card-active" data-parallax="0.07">
        <img className="card-skin" src="/hud-card.png" alt="" aria-hidden="true" />

        <div className="round-icon" aria-hidden="true">
          <span />
          <Lightbulb size={48} strokeWidth={1.25} />
        </div>

        <div className="round-copy">
          <p className="round-kicker">ROUND 1 // IDEATION</p>
          <h3>IDEATION SUBMISSION</h3>
          <p className="round-description">Shape the problem. Define the breakthrough. Submit your solution.</p>
          <a className="round-action round-action-active" href="#round-1">
            <span>GO TO ROUND 1 SUBMISSION</span>
            <ArrowRight size={16} strokeWidth={2} />
          </a>
        </div>
      </article>

      <div className="portal-bridge" aria-hidden="true">
        <div className="bridge-link-shell" data-parallax="-0.045">
          <img className="bridge-link-asset" src="/card-energy-bridge-v3.png" alt="" />
          <span className="bridge-link-pulse" />
        </div>
        <div className="bridge-link-readout">
          <span>01</span>
          <b>SYNC LINK</b>
          <span>02</span>
        </div>
      </div>

      <article className="round-card round-card-locked" data-parallax="0.04">
        <img className="card-skin" src="/hud-card.png" alt="" aria-hidden="true" />

        <div className="round-copy">
          <p className="round-kicker">ROUND 2 // FINALISTS</p>
          <h3>FINAL SUBMISSION</h3>
          <p className="round-description">The final portal activates for shortlisted teams after evaluation.</p>
          <button className="round-action round-action-locked" type="button" disabled>
            <span>ACCESS LOCKED</span>
            <LockKeyhole size={14} strokeWidth={1.5} />
          </button>
        </div>

        <div className="round-icon" aria-hidden="true">
          <span />
          <LockKeyhole size={48} strokeWidth={1.2} />
        </div>
      </article>
    </div>
  </section>
);

export default SubmissionPortal;
