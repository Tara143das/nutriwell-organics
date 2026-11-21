'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
  QUESTIONNAIRE_VERSION,
  CONSENT_NOTICE,
  REGISTRATION_QUESTIONS,
  COMMON_HEALTH_QUESTIONS,
} from '@/lib/wellnessAssessmentData';
import { evaluateAssessment } from '@/lib/wellnessEngine';

export default function HolisticChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('consent'); // 'consent' | 'register' | 'questions' | 'evaluating' | 'result'
  const [hasConsented, setHasConsented] = useState(false);
  
  // Seeker Demographics
  const [seeker, setSeeker] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
  });
  const [seekerErrors, setSeekerErrors] = useState({});

  // Answers Map
  const [answers, setAnswers] = useState({
    emergency_red_flags: [],
    r4_age: '',
    r5_biological_sex: '',
    r6_primary_concern: '',
    r7_concern_duration: '',
    c3_pregnancy_nursing: 'neither',
    c4_chronic_conditions: ['none_of_above'],
    c6_prescription_meds: 'no',
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Compile active question list
  const activeQuestions = [
    ...COMMON_HEALTH_QUESTIONS,
    ...REGISTRATION_QUESTIONS,
  ];

  // Mobile Validation (10-digit Indian Mobile)
  const validateSeeker = () => {
    const errors = {};
    if (!seeker.name.trim()) errors.name = 'Please enter your full name';
    const mobileDigits = seeker.mobile.replace(/\D/g, '');
    if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
      errors.mobile = 'Enter a valid 10-digit Indian mobile number (e.g. 9876543210)';
    }
    setSeekerErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartQuestions = (e) => {
    e.preventDefault();
    if (!validateSeeker()) return;
    setStep('questions');
    setCurrentQuestionIndex(0);
  };

  const handleOptionSelect = (questionId, optionValue, isMulti = false) => {
    setAnswers((prev) => {
      if (!isMulti) {
        return { ...prev, [questionId]: optionValue };
      }
      const existing = prev[questionId] || [];
      if (optionValue === 'none_of_above') {
        return { ...prev, [questionId]: ['none_of_above'] };
      }
      const filtered = existing.filter((item) => item !== 'none_of_above');
      if (filtered.includes(optionValue)) {
        const next = filtered.filter((item) => item !== optionValue);
        return { ...prev, [questionId]: next.length === 0 ? ['none_of_above'] : next };
      } else {
        return { ...prev, [questionId]: [...filtered, optionValue] };
      }
    });
  };

  const handleNextQuestion = () => {
    const currentQ = activeQuestions[currentQuestionIndex];
    const currentAnswer = answers[currentQ.id];

    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      alert('Please select an option to continue.');
      return;
    }

    // Immediate Early Minor Check on R4
    if (currentQ.id === 'r4_age' && currentAnswer === 'under-18') {
      finalizeAssessment({ ...answers, r4_age: 'under-18' });
      return;
    }

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finalizeAssessment(answers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep('register');
    }
  };

  const finalizeAssessment = async (finalAnswers) => {
    setStep('evaluating');
    const result = evaluateAssessment(finalAnswers);
    setAssessmentResult(result);

    // Save to Firestore 'wellnessAssessments'
    setIsSubmitting(true);
    try {
      const payload = {
        questionnaire_version: QUESTIONNAIRE_VERSION,
        seeker_name: seeker.name.trim(),
        seeker_mobile: seeker.mobile.replace(/\D/g, ''),
        seeker_email: seeker.email.trim() || null,
        seeker_city: seeker.city.trim() || null,
        answers: finalAnswers,
        evaluation_result: {
          safe: result.safe,
          triage_category: result.triage_category,
          primary_concern: result.primary_concern || null,
          safety_triage: result.safety_triage,
        },
        call_status: result.call_status_default,
        assigned_to: null,
        created_at: serverTimestamp(),
      };

      await addDoc(collection(db, 'wellnessAssessments'), payload);
      setSaveSuccess(true);
    } catch (err) {
      console.error('Failed to record wellness assessment lead:', err);
      // Fallback local storage backup
      try {
        const localBackups = JSON.parse(localStorage.getItem('nwo_assessment_backups') || '[]');
        localBackups.push({ ...seeker, answers: finalAnswers, date: new Date().toISOString() });
        localStorage.setItem('nwo_assessment_backups', JSON.stringify(localBackups));
      } catch (e) {
        // ignore storage error
      }
    } finally {
      setIsSubmitting(false);
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('consent');
    setHasConsented(false);
    setSeeker({ name: '', mobile: '', email: '', city: '' });
    setAnswers({
      emergency_red_flags: [],
      r4_age: '',
      r5_biological_sex: '',
      r6_primary_concern: '',
      r7_concern_duration: '',
      c3_pregnancy_nursing: 'neither',
      c4_chronic_conditions: ['none_of_above'],
      c6_prescription_meds: 'no',
    });
    setAssessmentResult(null);
    setCurrentQuestionIndex(0);
  };

  return (
    <>
      {/* 1. FLOATING ACTION TRIGGER (Image 2 style) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 group animate-bounce-subtle">
          <div className="hidden md:block bg-[#0a1813]/90 backdrop-blur-md border border-[#b07f24]/30 text-[#fdfcf8] px-3.5 py-1.5 rounded-full text-xs font-sans shadow-2xl">
            <span className="text-[#b07f24] font-semibold">Vaidya AI</span> • Clinical Wellness Triage
          </div>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Holistic Wellness Chatbot"
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0a3520] via-[#0f4d2c] to-[#14251b] border-2 border-[#b07f24]/60 text-[#b07f24] shadow-[0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 relative"
          >
            {/* Glowing Pulse Dot */}
            <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping opacity-75"></span>
            <span className="absolute top-1 right-1 w-3 h-3 bg-amber-500 rounded-full border border-black"></span>
            
            {/* Apothecary Flask SVG */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </button>
        </div>
      )}

      {/* 2. FLOATING RIGHT-CORNER ASSESSMENT WIDGET (Image 1 style) */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-1.5rem)] h-[620px] max-h-[88vh] bg-[#0a1813] border border-[#b07f24]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#fdfcf8] font-sans backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* HEADER BAR WITH MINIMIZE */}
          <div className="px-5 py-3.5 bg-[#0a2316]/90 border-b border-[#b07f24]/20 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-[#0f4d2c] border border-[#b07f24]/60 flex items-center justify-center text-[#b07f24]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#b07f24]">VAIDYA WELLNESS CORE</h3>
                <p className="text-[10px] text-emerald-400/80 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> NEURAL BOTANICAL LINK ACTIVE
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Minimize to Right Bottom */}
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize window"
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* MAIN CHAT CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar text-sm space-y-4">
            
            {/* STEP 1: CONSENT NOTICE */}
            {step === 'consent' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#0f2c1e]/60 border border-[#b07f24]/30 space-y-3">
                  <div className="flex items-center space-x-2 text-[#b07f24]">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold uppercase tracking-wider text-xs">MEDICAL DISCLAIMER & CONSENT</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {CONSENT_NOTICE.text}
                  </p>
                  <p className="text-[11px] text-stone-400 italic">
                    {CONSENT_NOTICE.subtext}
                  </p>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <input
                    type="checkbox"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-stone-600 text-[#0f4d2c] focus:ring-[#b07f24]"
                  />
                  <span className="text-xs text-stone-300">
                    I acknowledge that this assessment is strictly for educational & lifestyle guidance and is not a medical prescription.
                  </span>
                </label>

                <button
                  disabled={!hasConsented}
                  onClick={() => setStep('register')}
                  className="w-full py-3 rounded-xl bg-[#0f4d2c] hover:bg-[#145a34] disabled:opacity-40 disabled:cursor-not-allowed border border-[#b07f24]/50 text-white font-medium text-xs tracking-wider uppercase transition-all duration-200 shadow-lg"
                >
                  I Acknowledge & Proceed
                </button>
              </div>
            )}

            {/* STEP 2: SEEKER REGISTRATION */}
            {step === 'register' && (
              <form onSubmit={handleStartQuestions} className="space-y-4">
                <div className="border-b border-[#b07f24]/20 pb-2">
                  <h4 className="text-sm font-semibold text-[#f6f2e7]">Seeker Identification</h4>
                  <p className="text-xs text-stone-400">Please provide your details to personalize the clinical assessment.</p>
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={seeker.name}
                    onChange={(e) => setSeeker({ ...seeker, name: e.target.value })}
                    placeholder="e.g. Ananya Sen"
                    className="w-full px-3 py-2 rounded-lg bg-[#07130e] border border-stone-700 focus:border-[#b07f24] text-xs text-white outline-none"
                  />
                  {seekerErrors.name && <p className="text-[11px] text-rose-400 mt-1">{seekerErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs text-stone-300 mb-1">10-Digit Mobile Number (India) *</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg bg-stone-800 border border-r-0 border-stone-700 text-xs text-stone-400">+91</span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={seeker.mobile}
                      onChange={(e) => setSeeker({ ...seeker, mobile: e.target.value.replace(/\D/g, '') })}
                      placeholder="9876543210"
                      className="w-full px-3 py-2 rounded-r-lg bg-[#07130e] border border-stone-700 focus:border-[#b07f24] text-xs text-white outline-none"
                    />
                  </div>
                  {seekerErrors.mobile && <p className="text-[11px] text-rose-400 mt-1">{seekerErrors.mobile}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={seeker.email}
                      onChange={(e) => setSeeker({ ...seeker, email: e.target.value })}
                      placeholder="name@email.com"
                      className="w-full px-3 py-2 rounded-lg bg-[#07130e] border border-stone-700 focus:border-[#b07f24] text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-300 mb-1">City / Town</label>
                    <input
                      type="text"
                      value={seeker.city}
                      onChange={(e) => setSeeker({ ...seeker, city: e.target.value })}
                      placeholder="e.g. Kolkata"
                      className="w-full px-3 py-2 rounded-lg bg-[#07130e] border border-stone-700 focus:border-[#b07f24] text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0f4d2c] hover:bg-[#145a34] border border-[#b07f24]/50 text-white font-medium text-xs tracking-wider uppercase transition-all shadow-lg mt-2"
                >
                  Start Assessment Questionnaire
                </button>
              </form>
            )}

            {/* STEP 3: STEP-BY-STEP QUESTIONNAIRE */}
            {step === 'questions' && (
              <div className="space-y-4">
                {/* Progress Indicator */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-stone-400 font-mono">
                    <span>QUESTION {currentQuestionIndex + 1} OF {activeQuestions.length}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / activeQuestions.length) * 100)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#b07f24] to-emerald-400 transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question Prompt */}
                {(() => {
                  const q = activeQuestions[currentQuestionIndex];
                  const currentVal = answers[q.id];

                  return (
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-[#fdfcf8] leading-snug">{q.prompt}</h4>
                        {q.subtext && <p className="text-xs text-stone-400 mt-1">{q.subtext}</p>}
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt) => {
                          const isSelected = q.multi_select
                            ? Array.isArray(currentVal) && currentVal.includes(opt.value)
                            : currentVal === opt.value;

                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleOptionSelect(q.id, opt.value, q.multi_select)}
                              className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                                isSelected
                                  ? 'bg-[#0f4d2c]/80 border-[#b07f24] text-white font-medium shadow-md'
                                  : 'bg-[#07130e]/70 border-stone-800 text-stone-300 hover:border-stone-600 hover:bg-[#0c1f17]'
                              }`}
                            >
                              <span>{opt.label}</span>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-amber-400 bg-amber-400/20' : 'border-stone-600'
                                }`}
                              >
                                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Back / Next Nav */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <button
                    onClick={handlePreviousQuestion}
                    className="px-4 py-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-xs text-stone-300"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2 rounded-lg bg-[#0f4d2c] hover:bg-[#145a34] border border-[#b07f24]/50 text-xs text-white font-medium shadow-md"
                  >
                    {currentQuestionIndex === activeQuestions.length - 1 ? 'Evaluate Assessment' : 'Continue →'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: EVALUATING SPINNER */}
            {step === 'evaluating' && (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 border-3 border-[#b07f24] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="text-sm font-serif text-[#f6f2e7]">Synthesizing Ayurvedic Assessment...</h4>
                <p className="text-xs text-stone-400">Reviewing clinical safety thresholds and dosha metrics.</p>
              </div>
            )}

            {/* STEP 5: RESULTS DISPLAY */}
            {step === 'result' && assessmentResult && (
              <div className="space-y-4 animate-in fade-in duration-300">
                
                {/* 5A. UNDER-18 MINOR RESTRICTION SCREEN */}
                {assessmentResult.triage_category === 'MINOR_RESTRICTION' && (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/40 space-y-3">
                    <div className="flex items-center space-x-2 text-amber-400">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{assessmentResult.title}</h4>
                    </div>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {assessmentResult.message}
                    </p>
                    <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20 text-xs text-stone-300">
                      <p className="font-semibold text-amber-300 mb-1">Recommended Guardian Steps:</p>
                      <p>{assessmentResult.action_required}</p>
                    </div>
                    <p className="text-[11px] text-amber-200/70 italic">
                      {assessmentResult.guardian_note}
                    </p>
                  </div>
                )}

                {/* 5B. EMERGENCY STOP SCREEN */}
                {assessmentResult.triage_category === 'EMERGENCY_STOP' && (
                  <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-500/50 space-y-3">
                    <div className="flex items-center space-x-2 text-rose-400">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 9v4m0 4h.01" />
                      </svg>
                      <h4 className="text-xs font-bold uppercase tracking-wider">{assessmentResult.title}</h4>
                    </div>
                    <p className="text-xs text-rose-200 leading-relaxed">
                      {assessmentResult.message}
                    </p>
                    <div className="p-3 rounded-lg bg-black/40 border border-rose-500/30 text-xs font-semibold text-rose-300">
                      {assessmentResult.action_required}
                    </div>
                  </div>
                )}

                {/* 5C. MEDICAL CLEARANCE REQUIRED (PREGNANCY/CHRONIC) */}
                {assessmentResult.triage_category === 'MEDICAL_CLEARANCE_REQUIRED' && (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 space-y-3">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{assessmentResult.title}</h4>
                    <p className="text-xs text-stone-300 leading-relaxed">{assessmentResult.message}</p>
                    <div className="p-3 rounded-lg bg-black/40 border border-amber-500/20 text-xs text-stone-300">
                      {assessmentResult.action_required}
                    </div>
                  </div>
                )}

                {/* 5D. CLEARED DETERMINISTIC RESULTS (NO PRODUCT PUSHING) */}
                {assessmentResult.safe && (
                  <div className="space-y-4">
                    <div className="border-b border-[#b07f24]/20 pb-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#b07f24]">Clinical Assessment Summary</span>
                      <h4 className="text-sm font-serif text-[#f6f2e7]">{assessmentResult.title}</h4>
                    </div>

                    {/* Food suggestions */}
                    <div className="p-3.5 rounded-xl bg-[#0f2c1e]/60 border border-[#b07f24]/30 space-y-2">
                      <div className="flex items-center space-x-2 text-[#b07f24]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        <h5 className="text-xs font-semibold uppercase tracking-wider">Beneficial Dietary Habits</h5>
                      </div>
                      <p className="text-xs text-stone-300">{assessmentResult.foods.general_guideline}</p>
                      
                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-emerald-400">Recommended Additions:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {assessmentResult.foods.beneficial.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-[#0a3520] border border-emerald-500/30 text-[11px] text-stone-200">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-rose-400">Mindful Reductions:</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {assessmentResult.foods.limit.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-rose-950/40 border border-rose-500/30 text-[11px] text-stone-300">
                              ✕ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Exactly 2 Safe Yoga Practices */}
                    <div className="p-3.5 rounded-xl bg-[#0f2c1e]/60 border border-[#b07f24]/30 space-y-2">
                      <div className="flex items-center space-x-2 text-[#b07f24]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h5 className="text-xs font-semibold uppercase tracking-wider">Reviewed Yogic Practices (2 Selected)</h5>
                      </div>

                      <div className="space-y-2 pt-1">
                        {assessmentResult.yoga.practices.map((y, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg bg-[#07130e] border border-stone-800 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-amber-200">{idx + 1}. {y.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">{y.duration}</span>
                            </div>
                            <p className="text-[11px] text-stone-300">{y.guidance}</p>
                          </div>
                        ))}
                      </div>

                      <p className="text-[10px] text-amber-300/80 italic pt-1">
                        Caution: {assessmentResult.yoga.caution}
                      </p>
                    </div>
                  </div>
                )}

                {/* Telecaller Lead Confirmation Note */}
                <div className="p-3 rounded-lg bg-[#07130e] border border-stone-800 text-[11px] text-stone-400 text-center">
                  {saveSuccess
                    ? '✓ Your responses have been safely archived for our certified wellness tele-advisor.'
                    : 'Assessment completed locally.'}
                </div>

                {/* Reset / New Assessment */}
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 transition-colors font-medium"
                >
                  Start New Assessment
                </button>
              </div>
            )}
          </div>

          {/* FOOTER CLOSE BAR */}
          <div className="px-4 py-2.5 bg-[#06110c] border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
            <span>Nutriwell Holistic Tele-Triage</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#b07f24] hover:underline"
            >
              Minimize Widget
            </button>
          </div>
        </div>
      )}
    </>
  );
}