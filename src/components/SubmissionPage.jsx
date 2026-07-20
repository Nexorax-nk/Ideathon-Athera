import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, CheckCircle, CheckSquare, Square, Plus, Trash2, Users, User, Lock, ExternalLink, Download, ArrowRight, ArrowLeft, Lightbulb, Target, Cpu, Layout, Folder, FileCheck, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SubmissionPage.css';

const DRAFT_KEY = 'ideathon-round-one-draft';
const FORM_STEPS = ['Team', 'Idea', 'Tech', 'Finalize'];

const initialFormData = {
  teamName: '',
  leaderName: '',
  leaderEmail: '',
  teamSize: 'solo',
  member2Name: '',
  member2Email: '',
  title: '',
  pitch: '',
  problem: '',
  solution: '',
  innovation: '',
  targetUsers: [],
  otherTargetUser: '',
  impact: '',
  scalability: '',
  technologies: [],
  aiModels: '',
  features: [''],
  github: '',
  demo: '',
  declareOriginal: false,
  declareRules: false,
};

const loadDraft = () => {
  try {
    const savedDraft = window.localStorage.getItem(DRAFT_KEY);
    if (!savedDraft) return null;

    const parsedDraft = JSON.parse(savedDraft);
    return {
      currentStep: Math.min(Math.max(parsedDraft.currentStep || 1, 1), 4),
      formData: { ...initialFormData, ...parsedDraft.formData },
    };
  } catch {
    return null;
  }
};

/* ── HUD Panel wrapper: inner div + corner brackets ── */
const HudPanel = ({ className = '', children }) => (
  <div className={`form-section panel ${className}`}>
    <span className="panel-corner tl" />
    <span className="panel-corner tr" />
    <span className="panel-corner bl" />
    <span className="panel-corner br" />
    <div className="panel-inner">
      {children}
    </div>
  </div>
);

const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const SubmissionPage = () => {
  const [restoredDraft] = useState(loadDraft);
  const formRef = useRef(null);
  const [currentStep, setCurrentStep] = useState(restoredDraft?.currentStep || 1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  const [formData, setFormData] = useState(restoredDraft?.formData || initialFormData);
  const [stepError, setStepError] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  
  // File state
  const [pptFile, setPptFile] = useState(null);
  const [diagramFile, setDiagramFile] = useState(null);

  useEffect(() => {
    if (isSubmitted) return undefined;

    const saveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ currentStep, formData }));
        setLastSaved(new Date());
      } catch {
        // Draft saving is a convenience; form entry still works without storage access.
      }
    }, 400);

    return () => window.clearTimeout(saveTimer);
  }, [currentStep, formData, isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStepError('');
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (name, value) => {
    setStepError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (arrayName, item) => {
    setStepError('');
    setFormData(prev => {
      const array = prev[arrayName];
      if (array.includes(item)) {
        return { ...prev, [arrayName]: array.filter(i => i !== item) };
      }
      return { ...prev, [arrayName]: [...array, item] };
    });
  };

  const handleFeatureChange = (index, value) => {
    setStepError('');
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    if (formData.features.length === 1) return;
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const validateCurrentStep = () => {
    setStepError('');

    if (formRef.current && !formRef.current.checkValidity()) {
      setStepError('Complete the required fields before continuing.');
      formRef.current.reportValidity();
      return false;
    }

    if (currentStep === 3 && (formData.targetUsers.length === 0 || formData.technologies.length === 0)) {
      setStepError('Select at least one target user and one technology.');
      return false;
    }

    return true;
  };

  const scrollToFormTop = () => {
    window.requestAnimationFrame(() => {
      document.querySelector('.page-header')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep(prev => Math.min(prev + 1, 4));
    scrollToFormTop();
  };

  const prevStep = () => {
    setStepError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToFormTop();
  };

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result.split(',')[1];
      setter({
        filename: file.name,
        mimeType: file.type,
        base64: base64
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    const now = new Date();
    
    // Create form payload
    const payload = new URLSearchParams();
    
    // Add all text data
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        payload.append(key, formData[key].join(', '));
      } else {
        payload.append(key, formData[key]);
      }
    });

    // Add PPT file if uploaded
    if (pptFile) {
      payload.append('pptFile', pptFile.base64);
      payload.append('pptFilename', pptFile.filename);
      payload.append('pptMimeType', pptFile.mimeType);
    }
    
    // Add Diagram file if uploaded
    if (diagramFile) {
      payload.append('diagramFile', diagramFile.base64);
      payload.append('diagramFilename', diagramFile.filename);
      payload.append('diagramMimeType', diagramFile.mimeType);
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      });
      
      const subId = `ATH-R1-${Math.floor(1000 + Math.random() * 9000)}`;

      setSubmissionData({
        id: subId,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }),
        teamName: formData.teamName,
        title: formData.title,
      });
      setIsSubmitted(true);
      window.localStorage.removeItem(DRAFT_KEY);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const targetUserOptions = ["Students", "Hospitals", "Farmers", "Businesses", "General Public", "Other"];
  const techOptions = [
    "Artificial Intelligence", "Machine Learning", "Generative AI", 
    "Computer Vision", "NLP", "IoT", "Cloud Computing", "Blockchain", "Web", "Mobile", "Other"
  ];

  if (isSubmitted && submissionData) {
    return (
      <section className="submission-page success-view" aria-live="polite">
        <div className="mission-complete-card">
          <p className="success-eyebrow">TRANSMISSION COMPLETE</p>
          <div className="status-header">
            <CheckCircle size={30} className="success-icon glow" aria-hidden="true" />
            <div>
              <h1 className="success-title">Round 1 received</h1>
              <p>Your team is registered and your ideation submission is now in the review queue.</p>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Submission ID</span>
              <span className="status-value text-gold">{submissionData.id}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Submitted</span>
              <span className="status-value">{submissionData.date} ? {submissionData.time}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Team</span>
              <span className="status-value">{submissionData.teamName}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Idea</span>
              <span className="status-value">{submissionData.title}</span>
            </div>
          </div>

          <div className="status-badge-container">
            <span className="status-label">Current status</span>
            <div className="status-badge pulse-border">UNDER JUDGE REVIEW</div>
          </div>

          <div className="round2-locked-card mt-4">
            <div className="locked-header">
              <h3>ROUND 2</h3>
              <span className="locked-tag"><Lock size={14} /> LOCKED</span>
            </div>
            <p className="locked-desc">Final submission access will activate for shortlisted teams.</p>
          </div>

          <Link className="success-home-link" to="/">
            <ArrowLeft size={17} aria-hidden="true" /> RETURN TO EVENT HOME
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="submission-page">
      <div className="page-header">
        <p className="page-eyebrow">MISSION 01 // IDEATION</p>
        <h1 className="page-title">ROUND ONE</h1>
        <h2 className="page-subtitle">TEAM REGISTRATION &amp; IDEATION SUBMISSION</h2>
        <p className="page-intro">Register your team, frame the problem, and submit the idea you want to take forward.</p>
      </div>

      <div className="form-status-row" aria-live="polite">
        <span>STEP {currentStep} OF 4 ? {FORM_STEPS[currentStep - 1]}</span>
        <span className="draft-state">
          {lastSaved ? `DRAFT SAVED ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'DRAFT AUTOSAVE ON'}
        </span>
      </div>

      <ol className="wizard-steps" aria-label="Submission progress">
        {FORM_STEPS.map((label, index) => {
          const step = index + 1;
          return (
            <li
              key={label}
              className={`step-indicator ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}
              aria-current={currentStep === step ? 'step' : undefined}
            >
              <div className="step-circle">{currentStep > step ? <CheckCircle size={14} aria-hidden="true" /> : step}</div>
              <span className="step-label">{label}</span>
              {step < 4 && <div className="step-line" />}
            </li>
          );
        })}
      </ol>

      <form ref={formRef} className="submission-form" onSubmit={handleSubmit}>
        
        {/* ===================== STEP 1: TEAM ===================== */}
        {currentStep === 1 && (
          <div className="step-container slide-in">
            <HudPanel>
              <h3 className="section-title"><Users size={20} className="section-icon" /> Team Information</h3>
              
              <div className="form-group">
                <label>Team Name *</label>
                <input type="text" name="teamName" value={formData.teamName} onChange={handleInputChange} placeholder="Example: VisionX" required />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Team Leader Name *</label>
                  <input type="text" name="leaderName" value={formData.leaderName} onChange={handleInputChange} required />
                </div>
                <div className="form-group half">
                  <label>Team Leader Email *</label>
                  <input type="email" name="leaderEmail" value={formData.leaderEmail} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Team Size *</label>
                <div className="radio-group">
                  <button 
                    type="button" 
                    className={`radio-btn ${formData.teamSize === 'solo' ? 'active' : ''}`}
                    onClick={() => handleRadioChange('teamSize', 'solo')}
                  >
                    <User size={18} /> Solo
                  </button>
                  <button 
                    type="button" 
                    className={`radio-btn ${formData.teamSize === 'duo' ? 'active' : ''}`}
                    onClick={() => handleRadioChange('teamSize', 'duo')}
                  >
                    <Users size={18} /> Team of 2
                  </button>
                </div>
              </div>
            </HudPanel>

            <HudPanel>
              <h3 className="section-title"><Users size={20} className="section-icon" /> Team Members</h3>
              <div className="member-block">
                <h4>Member 1 (Leader)</h4>
                <div className="form-row">
                  <div className="form-group half">
                    <label>Full Name</label>
                    <input type="text" value={formData.leaderName} readOnly className="readonly-input" placeholder="Autofilled from above" />
                  </div>
                  <div className="form-group half">
                    <label>Email</label>
                    <input type="email" value={formData.leaderEmail} readOnly className="readonly-input" placeholder="Autofilled from above" />
                  </div>
                </div>
              </div>

              {formData.teamSize === 'duo' && (
                <div className="member-block mt-4">
                  <h4>Member 2</h4>
                  <div className="form-row">
                    <div className="form-group half">
                      <label>Full Name *</label>
                      <input type="text" name="member2Name" value={formData.member2Name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group half">
                      <label>Email *</label>
                      <input type="email" name="member2Email" value={formData.member2Email} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>
              )}
            </HudPanel>
          </div>
        )}

        {/* ===================== STEP 2: IDEA ===================== */}
        {currentStep === 2 && (
          <div className="step-container slide-in">
            <HudPanel className="ps-panel">
              <h3 className="section-title justify-center"><FileText size={20} className="section-icon" /> Submission Format</h3>
              <p className="ps-desc">Use this reference layout for your round one submission deck.</p>
              <a className="download-ps-btn" href="/round-one-problem-statement.pptx" download="round-one-problem-statement.pptx">
                <Download size={18} /> Download PPTX Template
              </a>
            </HudPanel>

            <HudPanel>
              <h3 className="section-title"><Lightbulb size={20} className="section-icon" /> Idea Submission</h3>
              
              <div className="form-group">
                <label>Project / Idea Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Example: MedAssist AI" required />
              </div>

              <div className="form-group">
                <label>One-Line Pitch * <span className="char-count">({formData.pitch.length}/150)</span></label>
                <input 
                  type="text" name="pitch" value={formData.pitch} onChange={handleInputChange} 
                  maxLength={150} placeholder="Example: AI-powered healthcare assistant for rural hospitals." required 
                />
              </div>

              <div className="form-group">
                <label>Problem Understanding * <span className="hint-text">"What problem are you solving?"</span></label>
                <textarea name="problem" value={formData.problem} onChange={handleInputChange} rows={4} required />
              </div>

              <div className="form-group">
                <label>Proposed Solution * <span className="hint-text">"Describe your idea."</span></label>
                <textarea name="solution" value={formData.solution} onChange={handleInputChange} rows={5} required />
              </div>

              <div className="form-group">
                <label>Why is your solution innovative? *</label>
                <textarea name="innovation" value={formData.innovation} onChange={handleInputChange} rows={3} required />
              </div>
            </HudPanel>
          </div>
        )}

        {/* ===================== STEP 3: TECH & MARKET ===================== */}
        {currentStep === 3 && (
          <div className="step-container slide-in">
            <HudPanel>
              <h3 className="section-title"><Target size={20} className="section-icon" /> Target Users & Impact</h3>
              
              <div className="form-group">
                <label>Target Users *</label>
                <div className="selectable-grid">
                  {targetUserOptions.map(user => {
                    const isSelected = formData.targetUsers.includes(user);
                    return (
                      <button 
                        key={user} type="button" 
                        className={`selectable-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleArrayItem('targetUsers', user)}
                      >
                        {isSelected && <CheckCircle size={16} className="sel-icon" />}
                        {user}
                      </button>
                    );
                  })}
                </div>
                {formData.targetUsers.includes("Other") && (
                  <input type="text" name="otherTargetUser" value={formData.otherTargetUser} onChange={handleInputChange} placeholder="Specify other users..." className="mt-2" required />
                )}
              </div>

              <div className="form-group">
                <label>Expected Impact * <span className="hint-text">How will your solution benefit users?</span></label>
                <textarea name="impact" value={formData.impact} onChange={handleInputChange} rows={3} required />
              </div>

              <div className="form-group">
                <label>Scalability * <span className="hint-text">How can this grow in the future?</span></label>
                <textarea name="scalability" value={formData.scalability} onChange={handleInputChange} rows={3} required />
              </div>
            </HudPanel>

            <HudPanel>
              <h3 className="section-title"><Cpu size={20} className="section-icon" /> Technology Stack</h3>
              
              <div className="form-group">
                <label>Technologies Used *</label>
                <div className="selectable-grid tech-grid">
                  {techOptions.map(tech => {
                    const isSelected = formData.technologies.includes(tech);
                    return (
                      <button 
                        key={tech} type="button" 
                        className={`selectable-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleArrayItem('technologies', tech)}
                      >
                        {isSelected && <CheckCircle size={16} className="sel-icon" />}
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group mt-4">
                <label>AI Models / APIs Used (Optional)</label>
                <input type="text" name="aiModels" value={formData.aiModels} onChange={handleInputChange} placeholder="Example: GPT-4, OpenCV, TensorFlow" />
              </div>
            </HudPanel>
          </div>
        )}

        {/* ===================== STEP 4: DESIGN & ATTACHMENTS ===================== */}
        {currentStep === 4 && (
          <div className="step-container slide-in">
            <HudPanel>
              <h3 className="section-title"><Layout size={20} className="section-icon" /> Solution Design</h3>
              
              <div className="form-group">
                <label>Key Features *</label>
                <div className="features-list">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="feature-row">
                      <span className="bullet">•</span>
                      <input type="text" value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} required />
                      {formData.features.length > 1 && (
                        <button type="button" className="btn-icon" onClick={() => removeFeature(index)}><Trash2 size={18} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-outline add-feature-btn" onClick={addFeature}>
                    <Plus size={16} /> Add Feature
                  </button>
                </div>
              </div>

              <div className="form-group mt-4">
                <label>Solution Workflow / Architecture (Optional)</label>
                <div className="upload-box wide">
                  <Upload size={24} className="upload-icon" />
                  <span>Upload Architecture Diagram</span>
                  <span className="file-types">PNG, JPG, PDF</span>
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={(e) => handleFileChange(e, setDiagramFile)} />
                  {diagramFile && <div style={{marginTop: '10px', fontSize: '12px', color: 'var(--gold)'}}>✓ {diagramFile.filename} attached</div>}
                </div>
              </div>
            </HudPanel>

            <HudPanel>
              <h3 className="section-title"><Folder size={20} className="section-icon" /> Attachments</h3>
              
              <div className="upload-grid">
                <div className="upload-box">
                  <FileText size={24} className="upload-icon" />
                  <span>Pitch Deck *</span>
                  <span className="file-types">PDF, PPTX</span>
                  <input type="file" accept=".pdf,.pptx" required onChange={(e) => handleFileChange(e, setPptFile)} />
                  {pptFile && <div style={{marginTop: '10px', fontSize: '12px', color: 'var(--gold)'}}>✓ {pptFile.filename} attached</div>}
                </div>
                <div className="upload-box">
                  <FileText size={24} className="upload-icon" />
                  <span>Additional Document (Optional)</span>
                  <span className="file-types">Any supporting doc</span>
                  <input type="file" />
                </div>
              </div>

              <div className="links-grid mt-4">
                <div className="form-group">
                  <label>Demo Link (Optional)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={16} />
                    <input type="text" name="demo" value={formData.demo} onChange={handleInputChange} placeholder="Google Drive / YouTube URL" />
                  </div>
                </div>
                <div className="form-group">
                  <label>GitHub Repository (Optional)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={16} />
                    <input type="text" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" />
                  </div>
                </div>
              </div>
            </HudPanel>

            <HudPanel className="declaration-panel">
              <h3 className="section-title"><FileCheck size={20} className="section-icon" /> Declaration</h3>
              <div className="declaration-list">
                <label className="checkbox-label declaration-label">
                  <input type="checkbox" name="declareOriginal" checked={formData.declareOriginal} onChange={handleInputChange} required />
                  <span className="checkbox-custom">{formData.declareOriginal ? <CheckSquare size={20} className="text-red" /> : <Square size={20} />}</span>
                  <span className="declaration-text">We declare that this submission is our original work.</span>
                </label>
                <label className="checkbox-label declaration-label">
                  <input type="checkbox" name="declareRules" checked={formData.declareRules} onChange={handleInputChange} required />
                  <span className="checkbox-custom">{formData.declareRules ? <CheckSquare size={20} className="text-red" /> : <Square size={20} />}</span>
                  <span className="declaration-text">We agree to abide by the event rules.</span>
                </label>
              </div>
            </HudPanel>
          </div>
        )}

        {stepError && (
          <div className="form-error" role="alert">
            <strong>CHECK REQUIRED FIELDS</strong>
            <span>{stepError}</span>
          </div>
        )}

        {/* Wizard Navigation */}
        <div className="wizard-nav">
          {currentStep > 1 ? (
            <button type="button" className="wizard-btn back-btn" onClick={prevStep}>
              <ArrowLeft size={18} /> BACK
            </button>
          ) : <div></div>}

          {currentStep < 4 ? (
            <button type="button" className="wizard-btn next-btn" onClick={nextStep}>
              NEXT <ArrowRight size={18} />
            </button>
          ) : (
            <button type="button" className="wizard-btn submit-btn glow-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>PROCESSING <Rocket size={18} className="spin-icon" /></>
              ) : (
                <><Rocket size={18} /> TRANSMIT SUBMISSION</>
              )}
            </button>
          )}
        </div>

      </form>
    </section>
  );
};

export default SubmissionPage;
