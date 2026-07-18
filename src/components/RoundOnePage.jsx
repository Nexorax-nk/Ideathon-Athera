import { ArrowLeft, Clock3, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubmissionPage from './SubmissionPage';
import './RoundOnePage.css';

const RoundOnePage = () => (
  <div className="app-shell round-one-shell">
    <div className="background-stage" aria-hidden="true">
      <video
        className="background-video is-ready"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
      >
        <source src="/ideathon-background.mp4" type="video/mp4" />
      </video>
      <div className="background-colorwash" />
      <div className="background-vignette" />
    </div>

    <header className="round-one-header">
      <Link className="round-one-brand" to="/" aria-label="Back to Ideathon home">
        <img src="/astra.png" alt="Ideathon" />
      </Link>

      <div className="round-one-live" aria-label="Round One portal is active">
        <span aria-hidden="true" />
        ROUND 01 // PORTAL ACTIVE
      </div>

      <Link className="round-one-back" to="/">
        <ArrowLeft size={16} aria-hidden="true" />
        BACK TO EVENT
      </Link>
    </header>

    <main className="round-one-main">
      <div className="round-one-assurance" aria-label="Submission details">
        <span><Clock3 size={16} aria-hidden="true" /> Takes about 10?15 minutes</span>
        <span><ShieldCheck size={16} aria-hidden="true" /> Draft saved on this device</span>
      </div>
      <SubmissionPage />
    </main>
  </div>
);

export default RoundOnePage;
