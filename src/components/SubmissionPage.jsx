import { useState } from 'react';
import { Upload, FileText, CheckCircle, CheckSquare, Square, Plus, Trash2, Users, User, Lock, ExternalLink, Download, ArrowRight, ArrowLeft, Lightbulb, Target, Cpu, Layout, Folder, FileCheck, Rocket } from 'lucide-react';
import './SubmissionPage.css';

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

const SubmissionPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);
  
  const [formData, setFormData] = useState({
    // Step 1: Team
    teamName: '',
    leaderName: '',
    leaderEmail: '',
    teamSize: 'solo', // 'solo' or 'duo'
    member2Name: '',
    member2Email: '',
    // Step 2: Idea
    title: '',
    pitch: '',
    problem: '',
    solution: '',
    innovation: '',
    // Step 3: Market & Tech
    targetUsers: [],
    otherTargetUser: '',
    impact: '',
    scalability: '',
    technologies: [],
    aiModels: '',
    // Step 4: Design & Attachments
    features: [''],
    github: '',
    demo: '',
    declareOriginal: false,
    declareRules: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (arrayName, item) => {
    setFormData(prev => {
      const array = prev[arrayName];
      if (array.includes(item)) {
        return { ...prev, [arrayName]: array.filter(i => i !== item) };
      }
      return { ...prev, [arrayName]: [...array, item] };
    });
  };

  const handleFeatureChange = (index, value) => {
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

  const handleDownloadPS = () => {
    alert('Downloading Problem Statement (Mock)');
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declareOriginal || !formData.declareRules) {
      alert("Please check all declaration boxes before submitting.");
      return;
    }
    
    const subId = `#IDEA-${Math.floor(100 + Math.random() * 900)}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setSubmissionData({ id: subId, time: time });
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const targetUserOptions = ["Students", "Hospitals", "Farmers", "Businesses", "General Public", "Other"];
  const techOptions = [
    "Artificial Intelligence", "Machine Learning", "Generative AI", 
    "Computer Vision", "NLP", "IoT", "Cloud Computing", "Blockchain", "Web", "Mobile", "Other"
  ];

  if (isSubmitted && submissionData) {
    return (
      <section className="submission-page success-view">
        <div className="mission-complete-card">
          <h1 className="success-title">MISSION STATUS</h1>
          <div className="status-header">
            <CheckCircle size={24} className="success-icon glow" />
            <h2>Round 1 Submitted</h2>
          </div>
          
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Submission ID</span>
              <span className="status-value text-gold">{submissionData.id}</span>
            </div>
            <div className="status-item">
              <span className="status-label">Submitted At</span>
              <span className="status-value">{submissionData.time}</span>
            </div>
          </div>

          <div className="status-badge-container">
            <span className="status-label">Current Status</span>
            <div className="status-badge pulse-border">
              UNDER JUDGE REVIEW
            </div>
          </div>
          
          <div className="round2-locked-card mt-4">
            <div className="locked-header">
              <h3>ROUND 2</h3>
              <span className="locked-tag"><Lock size={14} /> LOCKED</span>
            </div>
            <p className="locked-desc">Your submission is under evaluation.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="submission-page">
      <div className="page-header">
        <h1 className="page-title">MISSION 01</h1>
        <h2 className="page-subtitle">ROUND 1 - IDEATION SUBMISSION</h2>
      </div>

      {/* Step Indicator */}
      <div className="wizard-steps">
        {[1, 2, 3, 4].map(step => (
          <div key={step} className={`step-indicator ${currentStep === step ? 'active' : currentStep > step ? 'completed' : ''}`}>
            <div className="step-circle">{currentStep > step ? <CheckCircle size={14} /> : step}</div>
            <span className="step-label">
              {step === 1 && "Team"}
              {step === 2 && "Idea"}
              {step === 3 && "Tech"}
              {step === 4 && "Finalize"}
            </span>
            {step < 4 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <form className="submission-form" onSubmit={(e) => e.preventDefault()}>
        
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
              <h3 className="section-title justify-center"><FileText size={20} className="section-icon" /> Problem Statement</h3>
              <p className="ps-desc">Please review the problem statement requirements before submitting your idea.</p>
              <button type="button" className="download-ps-btn" onClick={handleDownloadPS}>
                <Download size={18} /> Download PS
              </button>
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
                  <input type="text" name="otherTargetUser" value={formData.otherTargetUser} onChange={handleInputChange} placeholder="Specify other users..." className="mt-2" />
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
                  <input type="file" accept=".png,.jpg,.jpeg,.pdf" />
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
                  <input type="file" accept=".pdf,.pptx" required />
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
                    <input type="url" name="demo" value={formData.demo} onChange={handleInputChange} placeholder="Google Drive / YouTube URL" />
                  </div>
                </div>
                <div className="form-group">
                  <label>GitHub Repository (Optional)</label>
                  <div className="input-with-icon">
                    <ExternalLink size={16} />
                    <input type="url" name="github" value={formData.github} onChange={handleInputChange} placeholder="GitHub URL" />
                  </div>
                </div>
              </div>
            </HudPanel>

            <HudPanel className="declaration-panel">
              <h3 className="section-title"><FileCheck size={20} className="section-icon" /> Declaration</h3>
              <div className="declaration-list">
                <label className="checkbox-label declaration-label">
                  <input type="checkbox" name="declareOriginal" checked={formData.declareOriginal} onChange={handleInputChange} />
                  <span className="checkbox-custom">{formData.declareOriginal ? <CheckSquare size={20} className="text-red" /> : <Square size={20} />}</span>
                  <span className="declaration-text">We declare that this submission is our original work.</span>
                </label>
                <label className="checkbox-label declaration-label">
                  <input type="checkbox" name="declareRules" checked={formData.declareRules} onChange={handleInputChange} />
                  <span className="checkbox-custom">{formData.declareRules ? <CheckSquare size={20} className="text-red" /> : <Square size={20} />}</span>
                  <span className="declaration-text">We agree to abide by the event rules.</span>
                </label>
              </div>
            </HudPanel>
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
            <button type="button" className="wizard-btn submit-btn glow-btn" onClick={handleSubmit}>
              <Rocket size={18} /> TRANSMIT SUBMISSION
            </button>
          )}
        </div>

      </form>
    </section>
  );
};

export default SubmissionPage;
